import { useVideoConfig, Sequence, AbsoluteFill } from 'remotion';
import { useState, useEffect } from 'react';

// 标题组件
export const TitleSlide = ({ title, subtitle }) => {
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h1
        style={{
          fontSize: 80,
          color: 'white',
          textAlign: 'center',
          fontFamily: 'system-ui',
          marginBottom: 20
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <h2
          style={{
            fontSize: 40,
            color: '#aaa',
            textAlign: 'center'
          }}
        >
          {subtitle}
        </h2>
      )}
    </AbsoluteFill>
  );
};

// 内容组件
export const ContentSlide = ({ content, type = 'text' }) => {
  const { fps, durationInFrames } = useVideoConfig();
  
  return (
    <AbsoluteFill
      style={{
        background: '#1a1a2e',
        padding: 80
      }}
    >
      {type === 'code' ? (
        <pre
          style={{
            fontSize: 30,
            color: '#4ec9b0',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}
        >
          {content}
        </pre>
      ) : (
        <p
          style={{
            fontSize: 40,
            color: 'white',
            lineHeight: 1.6
          }}
        >
          {content}
        </p>
      )}
    </AbsoluteFill>
  );
};

// 结尾组件
export const OutroSlide = ({ text }) => {
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h2
        style={{
          fontSize: 50,
          color: '#4ec9b0',
          textAlign: 'center'
        }}
      >
        {text || '感谢观看'}
      </h2>
      <p
        style={{
          fontSize: 30,
          color: '#888',
          marginTop: 40
        }}
      >
        关注我，学习更多AI技术
      </p>
    </AbsoluteFill>
  );
};

// 主视频组件
export const AiTutorial = ({ config }) => {
  const { fps } = useVideoConfig();
  
  let currentFrame = 0;
  
  return (
    <AbsoluteFill>
      {/* 标题页 */}
      <Sequence from={0} duration={5 * fps}>
        <TitleSlide
          title={config?.title || 'AI技术深度分析'}
          subtitle="Harness+Ralph框架实战"
        />
      </Sequence>
      
      {/* 内容页 */}
      {config?.segments?.slice(1, -1).map((segment, index) => {
        const startFrame = (5 + index * 5) * fps;
        return (
          <Sequence key={index} from={startFrame} duration={5 * fps}>
            <ContentSlide
              content={segment.content}
              type={segment.type || 'text'}
            />
          </Sequence>
        );
      })}
      
      {/* 结尾页 */}
      <Sequence
        from={(config?.duration - 3) * fps}
        duration={3 * fps}
      >
        <OutroSlide text={config?.outroText || '欢迎关注'} />
      </Sequence>
    </AbsoluteFill>
  );
};

export default AiTutorial;