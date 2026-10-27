'use client';

import { cn } from '@/lib/utils';
import { domAnimation, LazyMotion, m, MotionConfig, type HTMLMotionProps, type Variant } from 'motion/react';
import { forwardRef, type ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

const generateVariants = (direction: Direction): { hidden: Variant; visible: Variant } => {
  const horizontal = direction === 'left' || direction === 'right';
  const value = direction === 'right' || direction === 'down' ? 100 : -100;

  return {
    hidden: { filter: 'blur(10px)', opacity: 0, ...(horizontal ? { x: value } : { y: value }) },
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      ...(horizontal ? { x: 0 } : { y: 0 }),
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };
};

const defaultViewport = { amount: 0.3, margin: '0px 0px -200px 0px' };

interface ScrollAnimationProps extends Omit<HTMLMotionProps<'div'>, 'children' | 'variants' | 'viewport'> {
  children: ReactNode;
  className?: string;
  variants?: { hidden?: Variant; visible?: Variant };
  viewport?: { amount?: number; margin?: string; once?: boolean };
  delay?: number;
  /** `down`: o conteúdo vem de baixo para a posição final. */
  direction?: Direction;
}

/**
 * Gatilho de rolagem (usa `LazyMotion` para carregar só o necessário): ao entrar na tela, o conteúdo surge (desfoque e opacidade) vindo da direção indicada.
 * Respeita "reduzir movimento" do sistema (o deslocamento é desligado; só a opacidade aparece).
 */
const ScrollAnimation = forwardRef<HTMLDivElement, ScrollAnimationProps>(
  ({ children, className, variants, viewport = defaultViewport, delay = 0, direction = 'down', ...rest }, ref) => {
    const base = (variants as { hidden: Variant; visible: Variant } | undefined) ?? generateVariants(direction);
    const comAtraso = {
      hidden: base.hidden,
      visible: {
        ...base.visible,
        transition: { ...(base.visible as { transition?: object }).transition, delay },
      },
    };

    return (
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <m.div
            ref={ref}
            whileInView="visible"
            initial="hidden"
            variants={comAtraso}
            viewport={{ once: true, ...viewport }}
            className={cn(className)}
            {...rest}
          >
            {children}
          </m.div>
        </MotionConfig>
      </LazyMotion>
    );
  },
);

ScrollAnimation.displayName = 'ScrollAnimation';

export default ScrollAnimation;
