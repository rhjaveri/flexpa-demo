import React from 'react';

interface LoadingProps {
    text: string;
}

export function LoadingText({ text }: LoadingProps) {
    return (
        <h3>Loading {text}</h3>
    )
}