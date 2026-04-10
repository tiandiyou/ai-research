import { 
  AbsoluteFill, 
  useVideoConfig, 
  useCurrentFrame,
  spring,
  interpolate,
  Text,
  Img,
  Audio,
  Sequence,
  staticFile
} from "remotion";
import { useState, useEffect } from "react";

// 视频配置
const VIDEO_CONFIG = {
  fps: 30,
  width: 1080,
  height: 1920,
  duration: 300, // 5分钟 @ 30fps
};

// 颜色主题
const COLORS = {
  primary: "#00D4FF",
  background: "#0A0A1A",
  accent: "#FF6B6B",
  text: "#FFFFFF",
  secondary: "#1A1A2E",
};

// 数据驱动的内容
const VIDEO_CONTENT = {
  title: "AI Agent 2026革命",
  hook: {
    text: "2026年AI最大机会不是大模型，而是AI Agent！",
    duration: 90 // 3秒
  },
  sections: [
    {
      title: "为什么Agent是未来",
      points: [
        "大模型是工具，Agent是员工",
        "自动驾驶 vs 辅助驾驶的差距",
        "2026年各行业Agent应用爆发"
      ],
      duration: 240
    },
    {
      title: "普通人如何抓住红利",
      points: [
        "学Agent开发",
        "用Agent做副业",
        "Agent创业机会"
      ],
      duration: 240
    }
  ],
  cta: {
    text: "关注我，下期讲如何用Agent搞钱",
    duration: 150
  }
};

// 动画组件
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 30], [0, 1], { extrapolateRight: "clamp" });
  return <div style={{ opacity }}>{children}</div>;
};

const SlideIn = ({ children, delay = 0, direction = "left" }: { children: React.ReactNode; delay?: number; direction?: "left" | "right" }) => {
  const frame = useCurrentFrame();
  const offset = interpolate(frame, [delay, delay + 30], [direction === "left" ? -100 : 100, 0], { extrapolateRight: "clamp" });
  return <div style={{ transform: `translateX(${offset}px)` }}>{children}</div>;
};

const BounceText = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const frame = useCurrentFrame();
  const scale = spring({
    frame: frame - delay,
    fps: VIDEO_CONFIG.fps,
    config: { damping: 10 }
  });
  return <div style={{ transform: `scale(${scale})` }}>{children}</div>;
};

// 背景粒子效果
const ParticleBackground = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: COLORS.background }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${(frame * 0.5 + i * 50) % 100}%`,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: COLORS.primary,
            opacity: 0.5,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// 主标题组件
const TitleSlide = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 30], [0, 1]);
  const titleScale = spring({ frame, fps: VIDEO_CONFIG.fps, config: { damping: 10 } });
  
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <ParticleBackground />
      <div style={{ 
        transform: `scale(${titleScale})`, 
        opacity: titleOpacity,
        textAlign: "center" 
      }}>
        <Text style={{
          fontSize: 80,
          fontWeight: "bold",
          color: COLORS.primary,
          textShadow: `0 0 30px ${COLORS.primary}`,
          fontFamily: "Source Han Sans CN"
        }}>
          {VIDEO_CONTENT.title}
        </Text>
      </div>
    </AbsoluteFill>
  );
};

// 内容卡片组件
const ContentCard = ({ title, points, startFrame }: { title: string; points: string[]; startFrame: number }) => {
  const frame = useCurrentFrame() - startFrame;
  const isVisible = frame > 0 && frame < 300;
  
  if (!isVisible) return null;
  
  return (
    <AbsoluteFill style={{ padding: 60, justifyContent: "flex-start", alignItems: "center" }}>
      <FadeIn delay={30}>
        <Text style={{
          fontSize: 60,
          fontWeight: "bold",
          color: COLORS.accent,
          marginBottom: 40,
          textAlign: "center"
        }}>
          {title}
        </Text>
      </FadeIn>
      
      {points.map((point, i) => (
        <Sequence key={i} from={60 + i * 60}>
          <SlideIn delay={60 + i * 60} direction={i % 2 === 0 ? "left" : "right"}>
            <div style={{
              background: COLORS.secondary,
              padding: "20px 40px",
              borderRadius: 16,
              marginBottom: 20,
              border: `2px solid ${COLORS.primary}`
            }}>
              <Text style={{
                fontSize: 36,
                color: COLORS.text,
                textAlign: "center"
              }}>
                ✓ {point}
              </Text>
            </div>
          </SlideIn>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// CTA 结尾组件
const CtaEnd = () => {
  const frame = useCurrentFrame();
  const isActive = frame > 270;
  
  if (!isActive) return null;
  
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: COLORS.background }}>
      <BounceText delay={270}>
        <Text style={{
          fontSize: 50,
          color: COLORS.text,
          textAlign: "center",
          padding: "0 40px"
        }}>
          {VIDEO_CONTENT.cta.text}
        </Text>
      </BounceText>
      
      <div style={{
        marginTop: 40,
        display: "flex",
        gap: 20
      }}>
        {["👍 点赞", "💬 评论", "🔖 收藏", "📢 转发"].map((action, i) => (
          <div key={i} style={{
            background: i === 0 ? COLORS.accent : COLORS.secondary,
            padding: "16px 24px",
            borderRadius: 12
          }}>
            <Text style={{ fontSize: 28, color: COLORS.text }}>{action}</Text>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 字幕组件
const Subtitle = ({ text, startFrame, duration = 90 }: { text: string; startFrame: number; duration?: number }) => {
  const frame = useCurrentFrame();
  const isVisible = frame >= startFrame && frame < startFrame + duration;
  
  if (!isVisible) return null;
  
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 100 }}>
      <div style={{
        background: "rgba(0,0,0,0.8)",
        padding: "20px 40px",
        borderRadius: 12,
        maxWidth: "80%"
      }}>
        <Text style={{
          fontSize: 32,
          color: COLORS.text,
          textAlign: "center",
          lineHeight: 1.5
        }}>
          {text}
        </Text>
      </div>
    </AbsoluteFill>
  );
};

// 进度条
const ProgressBar = () => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const progress = frame / durationInFrames;
  
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end" }}>
      <div style={{
        height: 8,
        background: COLORS.secondary,
        width: "100%"
      }}>
        <div style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: COLORS.primary,
          transition: "width 0.1s"
        }} />
      </div>
    </AbsoluteFill>
  );
};

// 主视频组件
export const AiTutorial = () => {
  const { fps, durationInFrames } = useVideoConfig();
  
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {/* 开场Hook */}
      <Sequence from={0} durationInFrames={90}>
        <TitleSlide />
        <Subtitle text={VIDEO_CONTENT.hook.text} startFrame={30} duration={60} />
      </Sequence>
      
      {/* 第一部分 */}
      <Sequence from={90} durationInFrames={240}>
        <ContentCard 
          title={VIDEO_CONTENT.sections[0].title} 
          points={VIDEO_CONTENT.sections[0].points}
          startFrame={90}
        />
      </Sequence>
      
      {/* 第二部分 */}
      <Sequence from={180} durationInFrames={120}>
        <ContentCard 
          title={VIDEO_CONTENT.sections[1].title} 
          points={VIDEO_CONTENT.sections[1].points}
          startFrame={180}
        />
      </Sequence>
      
      {/* CTA */}
      <Sequence from={270} durationInFrames={30}>
        <CtaEnd />
      </Sequence>
      
      {/* 进度条 */}
      <ProgressBar />
    </AbsoluteFill>
  );
};
