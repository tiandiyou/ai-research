import { useVideoConfig, Sequence, AbsoluteFill, useCurrentFrame } from 'remotion';
import { useEffect, useState } from 'react';

// 动画工具函数
const fadeIn = (frame: number, startFrame: number, duration: number) => {
  const progress = Math.min(1, (frame - startFrame) / duration);
  return progress;
};

const slideIn = (frame: number, startFrame: number) => {
  const progress = Math.min(1, (frame - startFrame) / 30);
  return progress * 100;
};

// ===== 标题组件 =====
export const TitleSlide = ({ 
  title, 
  subtitle, 
  duration = 60 
}: { 
  title: string; 
  subtitle?: string; 
  duration?: number;
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, 0, 30);
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity
      }}
    >
      {/* 装饰圆环 */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        border: '2px solid rgba(78, 201, 176, 0.1)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }} />
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        border: '2px solid rgba(78, 201, 176, 0.2)'
      }} />
      
      {/* 主标题 */}
      <h1
        style={{
          fontSize: 100,
          color: '#ffffff',
          textAlign: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: 700,
          marginBottom: 30,
          textShadow: '0 0 40px rgba(78, 201, 176, 0.5)',
          letterSpacing: '-2px'
        }}
      >
        {title}
      </h1>
      
      {/* 副标题 */}
      {subtitle && (
        <h2
          style={{
            fontSize: 36,
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            fontWeight: 400
          }}
        >
          {subtitle}
        </h2>
      )}
      
      {/* 底部装饰 */}
      <div style={{
        position: 'absolute',
        bottom: 60,
        display: 'flex',
        gap: 20
      }}>
        {['Harness', 'Ralph', 'Remotion'].map((tag, i) => (
          <span
            key={tag}
            style={{
              padding: '8px 20px',
              background: 'rgba(78, 201, 176, 0.2)',
              borderRadius: 20,
              color: '#4ec9b0',
              fontSize: 18,
              border: '1px solid rgba(78, 201, 176, 0.3)'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ===== 内容组件 =====
export const ContentSlide = ({ 
  content, 
  type = 'text',
  highlight = []
}: { 
  content: string; 
  type?: 'text' | 'code' | 'list';
  highlight?: string[];
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn(frame, 0, 20);
  
  const textStyle = {
    fontSize: type === 'code' ? 28 : 42,
    color: '#ffffff',
    fontFamily: type === 'code' 
      ? '"Fira Code", "SF Mono", monospace' 
      : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: type === 'code' ? 1.6 : 1.5,
    whiteSpace: 'pre-wrap' as const,
    textAlign: 'left' as const
  };
  
  return (
    <AbsoluteFill
      style={{
        background: '#1a1a2e',
        padding: 80,
        opacity
      }}
    >
      {/* 左侧装饰条 */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 8,
        background: 'linear-gradient(180deg, #4ec9b0 0%, #302b63 100%)'
      }} />
      
      {/* 内容区域 */}
      <div style={{
        maxWidth: 1600,
        margin: '0 auto'
      }}>
        {type === 'list' ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {content.split('\n').map((line, i) => (
              <li
                key={i}
                style={{
                  ...textStyle,
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#4ec9b0',
                  marginRight: 20,
                  marginTop: 10,
                  flexShrink: 0
                }} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={textStyle}>{content}</p>
        )}
      </div>
      
      {/* 页码 */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        right: 60,
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: 24
      }}>
        AI技术深度分析
      </div>
    </AbsoluteFill>
  );
};

// ===== 代码块组件 =====
export const CodeBlock = ({ 
  code,
  language = 'typescript'
}: {
  code: string;
  language?: string;
}) => {
  return (
    <AbsoluteFill
      style={{
        background: '#0d1117',
        padding: 60
      }}
    >
      {/* 顶部标签 */}
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 30
      }}>
        {['●', '●', '●'].map((dot, i) => (
          <div key={i} style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: i === 0 ? '#ff5f56' : i === 1 ? '#ffbd2e' : '#27c93f'
          }} />
        ))}
      </div>
      
      {/* 语言标签 */}
      <div style={{
        display: 'inline-block',
        padding: '4px 12px',
        background: 'rgba(78, 201, 176, 0.1)',
        borderRadius: 4,
        color: '#4ec9b0',
        fontSize: 14,
        marginBottom: 20
      }}>
        {language}
      </div>
      
      {/* 代码内容 */}
      <pre style={{
        fontSize: 26,
        color: '#c9d1d9',
        fontFamily: '"Fira Code", "SF Mono", monospace',
        lineHeight: 1.8,
        overflow: 'hidden'
      }}>
        {code}
      </pre>
    </AbsoluteFill>
  );
};

// ===== 结尾组件 =====
export const OutroSlide = ({ 
  text = '感谢观看',
  cta = '欢迎关注我，学习更多AI技术'
}: { 
  text?: string;
  cta?: string;
}) => {
  const frame = useCurrentFrame();
  const scale = 1 + Math.sin(frame * 0.05) * 0.02;
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0c29 100%)',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h2
        style={{
          fontSize: 80,
          color: '#4ec9b0',
          textAlign: 'center',
          transform: `scale(${scale})`,
          fontWeight: 600
        }}
      >
        {text}
      </h2>
      
      <p
        style={{
          fontSize: 32,
          color: 'rgba(255, 255, 255, 0.6)',
          marginTop: 40,
          textAlign: 'center'
        }}
      >
        {cta}
      </p>
      
      {/* 二维码占位 */}
      <div style={{
        marginTop: 60,
        width: 200,
        height: 200,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.3)'
      }}>
        QR Code
      </div>
    </AbsoluteFill>
  );
};

// ===== 主视频模板 =====
export const AITutorialVideo = ({ config }) => {
  const { fps } = useVideoConfig();
  
  return (
    <>
      {/* 标题 */}
      <Sequence from={0} duration={5 * fps}>
        <TitleSlide
          title={config?.title || 'AI技术深度分析'}
          subtitle={config?.subtitle || '基于Harness+Ralph框架'}
        />
      </Sequence>
      
      {/* 内容段落 */}
      {config?.segments?.map((segment, i) => {
        const startFrame = (5 + i * 5) * fps;
        return (
          <Sequence key={i} from={startFrame} duration={5 * fps}>
            <ContentSlide
              content={segment.content}
              type={segment.type || 'text'}
              highlight={segment.highlight}
            />
          </Sequence>
        );
      })}
      
      {/* 结尾 */}
      <Sequence
        from={(config?.duration || 60) - 3 * fps}
        duration={3 * fps}
      >
        <OutroSlide
          text={config?.outroText || '感谢观看'}
          cta={config?.ctaText || '欢迎关注，学习更多AI技术'}
        />
      </Sequence>
    </>
  );
};

export default AITutorialVideo;