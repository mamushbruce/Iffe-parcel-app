
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

class DeerAnimator {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private animationState: {
        legSwing: number;
        bodyBounce: number;
        earTwitch: number;
        position: number;
        running: boolean;
    };
    private colors: {
        body: string;
        highlight: string;
        legs: string;
        ears: string;
    };

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get 2D context from canvas');
        }
        this.ctx = context;
        this.width = canvas.width = 300;
        this.height = canvas.height = 200;
        
        this.animationState = {
            legSwing: 0,
            bodyBounce: 0,
            earTwitch: 0,
            position: -50,
            running: true
        };
        
        this.colors = {
            body: '#8B4513',
            highlight: '#A0522D',
            legs: '#654321',
            ears: '#5D4037'
        };
    }

    private drawDeer() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        const state = this.animationState;
        const bounce = Math.sin(state.bodyBounce) * 3;
        const legSwing = Math.sin(state.legSwing) * 15;
        const earMove = Math.sin(state.earTwitch) * 5;

        // Draw running trail
        this.ctx.fillStyle = 'rgba(233, 196, 106, 0.1)';
        for (let i = 0; i < 5; i++) {
            const trailX = state.position - i * 20;
            if (trailX > -20) {
                this.ctx.beginPath();
                this.ctx.ellipse(trailX + 180, 175, 8 + i * 2, 3 + i, 0, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        // Draw legs with running animation
        this.drawLeg(130 + state.position, 140 + bounce, 8, 40 + legSwing, this.colors.legs);
        this.drawLeg(150 + state.position, 140 + bounce, 8, 40 - legSwing, this.colors.legs);
        this.drawLeg(170 + state.position, 140 + bounce, 8, 40 + legSwing, this.colors.legs);
        this.drawLeg(190 + state.position, 140 + bounce, 8, 40 - legSwing, this.colors.legs);

        // Draw body, neck, head
        this.ctx.fillStyle = this.colors.body;
        this.ctx.beginPath();
        this.ctx.ellipse(150 + state.position, 120 + bounce, 40, 20, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(150 + state.position, 100 + bounce, 15, 20, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(150 + state.position, 70 + bounce, 17, 15, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw ears and eye
        this.drawEar(135 + state.position, 60 + bounce - earMove, 12, 20, this.colors.ears);
        this.drawEar(165 + state.position, 60 + bounce + earMove, 12, 20, this.colors.ears);
        this.ctx.fillStyle = '#2a9d8f';
        this.ctx.beginPath();
        this.ctx.arc(160 + state.position, 70 + bounce, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw antlers
        this.ctx.strokeStyle = '#5D4037';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(140 + state.position, 55 + bounce);
        this.ctx.lineTo(135 + state.position, 45 + bounce);
        this.ctx.moveTo(160 + state.position, 55 + bounce);
        this.ctx.lineTo(165 + state.position, 45 + bounce);
        this.ctx.stroke();
    }

    private drawLeg(x: number, y: number, width: number, height: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    private drawEar(x: number, y: number, width: number, height: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, width / 2, height / 2, Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    private update() {
        this.animationState.legSwing += 0.5;
        this.animationState.bodyBounce += 0.2;
        this.animationState.earTwitch += 0.1;
        this.animationState.position += 2;
        if (this.animationState.position > 350) {
            this.animationState.position = -50;
        }
    }

    public animate() {
        if (!this.animationState.running) return;
        this.update();
        this.drawDeer();
        requestAnimationFrame(() => this.animate());
    }

    public stop() {
        this.animationState.running = false;
    }
}

export default function DeerPreloader() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!canvasRef.current) return;

        const deerAnimator = new DeerAnimator(canvasRef.current);
        deerAnimator.animate();
        
        let currentProgress = 0;
        const loadingInterval = setInterval(() => {
            currentProgress += Math.random() * 8;
            if (currentProgress >= 100) {
                currentProgress = 100;
                setProgress(100);
                clearInterval(loadingInterval);
                
                setTimeout(() => {
                    setVisible(false);
                    deerAnimator.stop();
                }, 800);
            }
            setProgress(currentProgress);
        }, 200);

        return () => {
            clearInterval(loadingInterval);
            deerAnimator.stop();
        };
    }, []);

    if (!visible) return null;

    return (
        <div className={cn(
            "fixed top-0 left-0 w-full h-full z-[100] flex flex-col justify-center items-center",
            "bg-gradient-to-br from-blue-900 to-gray-900"
        )}>
            <div className="relative w-[300px] h-[200px] mb-8">
                <canvas ref={canvasRef} className="w-full h-full"></canvas>
            </div>
            <div className="text-center">
                <div className="text-2xl text-[#e9c46a] font-bold mb-2 tracking-[3px]">
                    IFFE • TRAVELS LTD
                </div>
                <div className="text-sm text-[#a8dadc] mb-6 italic">
                    Rooted to Nature
                </div>
                <div className="text-base text-[#e9c46a] mb-5 tracking-[2px]">
                    PREPARING YOUR SAFARI
                </div>
                <div className="w-[300px] h-[6px] bg-yellow-300/20 rounded overflow-hidden mb-2">
                    <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded" 
                        style={{ width: `${Math.min(progress, 100)}%`, transition: 'width 0.3s ease' }}
                    ></div>
                </div>
                <div className="text-[#e9c46a] text-sm font-bold">
                    {Math.min(progress, 100).toFixed(0)}%
                </div>
            </div>
        </div>
    );
}
