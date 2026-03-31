"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

// 定义接口，确保类型安全
interface SoulProps {
  isTalking: boolean;
  modelPath: string;
}

export default function Soul({ isTalking, modelPath }: SoulProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<any>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    // 🛡️ 防空盾：如果路径是空的，直接不执行，防止报错崩溃
    if (!modelPath) {
      console.warn("⚠️ Soul 组件未收到模型路径，跳过加载");
      return;
    }

    let isMounted = true;

    const init = async () => {
      // 1. 检查 Live2D 库是否可用
      if (!(window as any).Live2DCubismCore) {
        console.warn("⚠️ Live2D 库未加载，跳过模型渲染");
        return;
      }

      // 2. 加载插件
      // @ts-ignore
      const { Live2DModel } = await import('pixi-live2d-display/cubism4');
      (window as any).PIXI = PIXI;
      Live2DModel.registerTicker(PIXI.Ticker);

      if (!canvasRef.current || !isMounted) return;

      if (appRef.current) appRef.current.destroy(true);

      const app = new PIXI.Application({
        view: canvasRef.current,
        autoStart: true,
        backgroundAlpha: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio || 1,
      });
      appRef.current = app;

      // 🛡️ 兼容补丁：防止 manager.on 报错
      const interaction = app.renderer.plugins.interaction;
      if (interaction) {
          if (!interaction.on) interaction.on = () => {};
          if (!interaction.off) interaction.off = () => {};
          if (!interaction.addListener) interaction.addListener = () => {};
          if (!interaction.removeListener) interaction.removeListener = () => {};
      }

      try {
        console.log("🚀 正在加载人物:", modelPath);
        
        // 加载模型
        const _model = await Live2DModel.from(modelPath);
        
        // 🛡️ 交互补丁：双重保险关掉交互
        _model.interactive = false;

        if (!isMounted) return;
        app.stage.addChild(_model);
        
        // 📐 智能缩放
        const isMale = modelPath.toLowerCase().includes('chitose');
        const scaleBase = isMale ? 0.6 : 0.8; 
        const scale = (window.innerHeight * scaleBase) / _model.height;
        
        _model.scale.set(scale);
        _model.x = (window.innerWidth - _model.width) / 2;
        _model.y = window.innerHeight * 0.1;

        setModel(_model);

      } catch (e) {
        console.error("❌ 加载失败:", e);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [modelPath]); // 当路径变化时重新运行

  // 嘴型同步逻辑
  useEffect(() => {
    if (!model || !isTalking) return;
    let mouthValue = 0;
    let direction = 0.2;
    const ticker = () => {
      mouthValue += direction;
      if (mouthValue > 1 || mouthValue < 0) direction *= -1;
      if (model.internalModel?.coreModel?.setParameterValueById) {
          model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', mouthValue);
      }
    };
    PIXI.Ticker.shared.add(ticker);
    return () => {
      PIXI.Ticker.shared.remove(ticker);
    };
  }, [isTalking, model]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-10 pointer-events-none brightness-[0.7] contrast-110 drop-shadow-2xl" 
    />
  );
}