import React, { useState, useEffect } from 'react';
import 'aframe';
import { Entity, Scene } from 'aframe-react';

function HandTrackingScene() {
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
    const [lastHandRotation, setLastHandRotation] = useState(null);

    useEffect(() => {
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl) {
            sceneEl.addEventListener('trackingupdated', (evt) => {
                const hand = evt.detail.hand;
                if (hand) {
                    setLastHandRotation(new THREE.Euler().fromArray(hand.rotation));
                }
            });
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const sceneEl = document.querySelector('a-scene');
            const hand = sceneEl?.systems['tracked-controls-webxr']?.getController(0);
            if (hand && hand.pose) {
                const handRotation = new THREE.Euler().fromArray(hand.pose.orientation);
                if (lastHandRotation) {
                    const deltaY = handRotation.y - lastHandRotation.y;
                    setRotation(prevRotation => ({
                        ...prevRotation,
                        y: prevRotation.y + THREE.Math.radToDeg(deltaY)
                    }));
                    setLastHandRotation(handRotation);
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [lastHandRotation]);

    return (
        <Scene oculus-hand-tracking>
            <Entity primitive="a-light" type="ambient" intensity="0.5" />
            <Entity primitive="a-light" type="directional" intensity="0.5" position="-1 1 1" />
            <Entity hand-tracking-model="hand: left; modelStyle: lowPoly; color: #cccccc" />
            <Entity hand-tracking-model="hand: right; modelStyle: lowPoly; color: #cccccc" />
            <Entity primitive="a-box" position="0 1.5 -2" rotation={rotation} color="#4CC3D9" />
        </Scene>
    );
}

export default HandTrackingScene;
