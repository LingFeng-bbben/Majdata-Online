import { useState, useRef, useEffect, forwardRef } from 'react';
import React from "react";

export default function TagManageWidget({songid}) {
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const buttonRef = useRef(null);
    const windowRef = useRef(null);

    return (
        <div>
            <TagManageButton
                ref={buttonRef}
                onClick={() => setIsWindowOpen(!isWindowOpen)}
                songid={songid}  // Pass songid to Button
            />
            {isWindowOpen && (
                <TagManageWindow
                    ref={windowRef}
                    onClose={() => setIsWindowOpen(false)}
                    buttonRef={buttonRef}
                    songid={songid}  // Pass songid to Window
                />
            )}
        </div>
    );
}

const TagManageButton = forwardRef(({ onClick, songid }, ref) => (
    <button
        ref={ref}
        onClick={onClick}
        style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            zIndex: 1000
        }}
    >
        管理标签 (Song ID: {songid})
    </button>
));

const TagManageWindow = forwardRef(({ onClose, buttonRef, songid }, ref) => {
    const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: 100 });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dragging) return;
            if (
                ref.current &&
                !ref.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, ref, buttonRef, dragging]);

    const handleMouseDown = (e) => {
        setDragging(true);
        const rect = ref.current.getBoundingClientRect();
        setOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragging) {
                setPosition({
                    x: e.clientX - offset.x,
                    y: e.clientY - offset.y
                });
            }
        };

        const handleMouseUp = () => setDragging(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, offset]);

    return (
        <div
            ref={ref}
            style={{
                position: 'fixed',
                left: position.x + 'px',
                top: position.y + 'px',
                width: '400px',
                minHeight: '300px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1001,
                cursor: dragging ? 'grabbing' : 'default',
                border: "1px solid whitesmoke"
            }}
        >
            {/* 可拖动区域 */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    padding: '16px',
                    borderBottom: '1px solid #eee',
                    cursor: 'grab',
                    userSelect: 'none'
                }}
            >
                标签管理窗口 (Song ID: {songid})
            </div>

            {/* 窗口内容 */}
            <div style={{ padding: '16px' }}>
                {/* 在这里添加你的标签管理内容 */}
                <p>当前歌曲ID: {songid}</p>
                <p>标签列表...</p>
            </div>
        </div>
    );
});