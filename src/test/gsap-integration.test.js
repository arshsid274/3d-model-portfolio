import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock GSAP modules before importing
vi.mock('gsap', () => ({
    gsap: {
        registerPlugin: vi.fn(),
        timeline: vi.fn(() => ({
            fromTo: vi.fn().mockReturnThis(),
            to: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            kill: vi.fn().mockReturnThis(),
            progress: vi.fn().mockReturnThis(),
            repeat: vi.fn().mockReturnThis(),
            repeatDelay: vi.fn().mockReturnThis(),
            delay: vi.fn().mockReturnThis(),
            duration: vi.fn().mockReturnThis(),
            ease: vi.fn().mockReturnThis(),
            stagger: vi.fn().mockReturnThis(),
        })),
        fromTo: vi.fn().mockReturnValue({
            kill: vi.fn(),
            progress: vi.fn().mockReturnThis(),
        }),
        to: vi.fn().mockReturnValue({
            kill: vi.fn(),
            progress: vi.fn().mockReturnThis(),
        }),
        from: vi.fn().mockReturnValue({
            kill: vi.fn(),
            progress: vi.fn().mockReturnThis(),
        }),
        set: vi.fn(),
        killTweensOf: vi.fn(),
        getTweensOf: vi.fn(() => []),
    },
    default: {
        registerPlugin: vi.fn(),
        timeline: vi.fn(() => ({
            fromTo: vi.fn().mockReturnThis(),
            to: vi.fn().mockReturnThis(),
            from: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            kill: vi.fn().mockReturnThis(),
            progress: vi.fn().mockReturnThis(),
            repeat: vi.fn().mockReturnThis(),
            repeatDelay: vi.fn().mockReturnThis(),
            delay: vi.fn().mockReturnThis(),
            duration: vi.fn().mockReturnThis(),
            ease: vi.fn().mockReturnThis(),
            stagger: vi.fn().mockReturnThis(),
        })),
        fromTo: vi.fn().mockReturnValue({
            kill: vi.fn(),
            progress: vi.fn().mockReturnThis(),
        }),
        to: vi.fn().mockReturnValue({
            kill: vi.fn(),
            progress: vi.fn().mockReturnThis(),
        }),
        from: vi.fn().mockReturnValue({
            kill: vi.fn(),
            progress: vi.fn().mockReturnThis(),
        }),
        set: vi.fn(),
        killTweensOf: vi.fn(),
        getTweensOf: vi.fn(() => []),
    }
}));

vi.mock('gsap/ScrollTrigger', () => ({
    ScrollTrigger: {
        create: vi.fn(),
        refresh: vi.fn(),
        update: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        config: vi.fn(),
        batch: vi.fn(),
        getAll: vi.fn(() => []),
        killAll: vi.fn(),
    }
}));

vi.mock('gsap/SplitText', () => ({
    SplitText: vi.fn().mockImplementation(() => ({
        chars: [{ style: {} }, { style: {} }],
        words: [{ style: {} }, { style: {} }],
        lines: [{ style: {} }],
        revert: vi.fn(),
    }))
}));

vi.mock('gsap/ScrollSmoother', () => ({
    ScrollSmoother: {
        create: vi.fn(() => ({
            paused: vi.fn(),
            kill: vi.fn(),
            refresh: vi.fn(),
        })),
        get: vi.fn(),
    }
}));

vi.mock('../components/Navbar', () => ({
    smoother: {
        paused: vi.fn()
    }
}));

// Import the modules we're testing after mocking
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import setSplitText from '../components/utils/splitText.js';
import { setCharTimeline, setAllTimeline } from '../components/utils/GsapScroll.js';
import { initialFX } from '../components/utils/initialFX.js';

describe('GSAP Integration Tests', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Setup DOM elements that GSAP functions expect
        document.body.innerHTML = `
      <main>
        <div class="landing-section">
          <div class="landing-container">
            <div class="landing-info">
              <h3>Test H3</h3>
            </div>
            <div class="landing-intro">
              <h1>Test H1</h1>
              <h2>Test H2</h2>
            </div>
            <div class="landing-h2-info">Test Info</div>
            <div class="landing-info-h2">Test Info H2</div>
            <div class="landing-h2-info-1">Test Info 1</div>
            <div class="landing-h2-1">Test H2 1</div>
            <div class="landing-h2-2">Test H2 2</div>
          </div>
        </div>
        <div class="about-section">
          <div class="about-me">About content</div>
          <p class="para">Test paragraph</p>
          <h2 class="title">Test title</h2>
        </div>
        <div class="whatIDO">
          <div class="what-box-in" style="display: none;">What I Do</div>
        </div>
        <div class="career-section">
          <div class="career-timeline"></div>
          <div class="career-info-box"></div>
          <div class="career-dot"></div>
        </div>
        <div class="character-model">
          <div class="character-rim"></div>
        </div>
        <div class="header"></div>
        <div class="icons-section"></div>
        <div class="nav-fade"></div>
      </main>
    `;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('GSAP Migration - Plugin Registration and Import Structure', () => {
        it('should use standard GSAP imports instead of gsap-trial', () => {
            // Verify that modules are imported from standard GSAP paths
            expect(gsap).toBeDefined();
            expect(ScrollTrigger).toBeDefined();
            expect(SplitText).toBeDefined();

            // Ensure no trial-specific properties or methods
            expect(gsap.registerPlugin).toBeDefined();
            expect(typeof gsap.registerPlugin).toBe('function');
        });

        it('should register all required GSAP plugins correctly', () => {
            // Plugin registration should have been called during module import
            expect(gsap.registerPlugin).toHaveBeenCalled();

            // Verify ScrollTrigger is properly available
            expect(ScrollTrigger.create).toBeDefined();
            expect(ScrollTrigger.refresh).toBeDefined();
            expect(ScrollTrigger.config).toBeDefined();

            // Verify SplitText is properly available
            expect(SplitText).toBeDefined();
            expect(typeof SplitText).toBe('function');
        });

        it('should maintain GSAP functionality without trial limitations', () => {
            // Test that core GSAP methods are available
            expect(gsap.timeline).toBeDefined();
            expect(gsap.fromTo).toBeDefined();
            expect(gsap.to).toBeDefined();
            expect(gsap.set).toBeDefined();

            // Test timeline creation
            const timeline = gsap.timeline();
            expect(timeline).toBeDefined();
            expect(timeline.fromTo).toBeDefined();
            expect(timeline.to).toBeDefined();
        });

        it('should not show any trial version warnings or limitations', () => {
            // Mock console.warn to catch any trial warnings
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            // Execute GSAP functions that might trigger trial warnings
            gsap.timeline();
            gsap.to({}, { duration: 1 });
            new SplitText('test');

            // Verify no trial warnings were logged
            expect(consoleSpy).not.toHaveBeenCalledWith(
                expect.stringMatching(/trial|license|gsap-trial/i)
            );

            consoleSpy.mockRestore();
        });
    });

    describe('Animation Timeline Functionality - Post Migration', () => {
        it('should maintain exact same timeline structure after GSAP migration', () => {
            const mockCharacter = {
                children: [
                    {
                        name: 'Plane004',
                        children: [
                            {
                                material: {
                                    transparent: true,
                                    opacity: 1,
                                    name: 'Material.027',
                                    color: { set: vi.fn() }
                                }
                            }
                        ]
                    },
                    {
                        name: 'screenlight',
                        material: {
                            transparent: true,
                            opacity: 1,
                            emissive: { set: vi.fn() }
                        }
                    }
                ],
                rotation: { y: 0, x: 0 },
                getObjectByName: vi.fn(() => ({
                    rotation: { x: 0 }
                }))
            };

            const mockCamera = {
                position: { z: 20, y: 0 }
            };

            setCharTimeline(mockCharacter, mockCamera);

            // Verify exact timeline count (3 for desktop)
            expect(gsap.timeline).toHaveBeenCalledTimes(3);

            // Verify scroll triggers maintain exact same configuration
            const timelineCalls = gsap.timeline.mock.calls;

            // Landing section timeline
            expect(timelineCalls[0][0]).toEqual({
                scrollTrigger: {
                    trigger: '.landing-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            });

            // About section timeline
            expect(timelineCalls[1][0]).toEqual({
                scrollTrigger: {
                    trigger: '.about-section',
                    start: 'center 55%',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            });

            // What I Do section timeline
            expect(timelineCalls[2][0]).toEqual({
                scrollTrigger: {
                    trigger: '.whatIDO',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            });
        });

        it('should preserve career section timeline configuration', () => {
            setAllTimeline();

            // Verify exact timeline configuration is maintained
            expect(gsap.timeline).toHaveBeenCalledWith({
                scrollTrigger: {
                    trigger: '.career-section',
                    start: 'top 30%',
                    end: '100% center',
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            });
        });

        it('should maintain responsive breakpoint behavior at 1024px', () => {
            // Test desktop behavior (>1024px)
            Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });

            const mockCharacter = {
                children: [],
                rotation: { y: 0, x: 0 },
                getObjectByName: vi.fn(() => ({ rotation: { x: 0 } }))
            };
            const mockCamera = { position: { z: 20, y: 0 } };

            setCharTimeline(mockCharacter, mockCamera);

            // Desktop should create 3 main timelines
            expect(gsap.timeline).toHaveBeenCalledTimes(3);

            // Test mobile behavior (<=1024px)
            Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true });
            vi.clearAllMocks();

            setCharTimeline(mockCharacter, mockCamera);

            // Mobile creates different timeline structure
            expect(gsap.timeline).toHaveBeenCalled();
        });

        it('should maintain character animation properties and timing', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });

            const mockCharacter = {
                children: [
                    {
                        name: 'screenlight',
                        material: {
                            transparent: true,
                            opacity: 0,
                            emissive: { set: vi.fn() }
                        }
                    }
                ],
                rotation: { y: 0, x: 0 },
                getObjectByName: vi.fn(() => ({ rotation: { x: 0 } }))
            };
            const mockCamera = { position: { z: 20, y: 0 } };

            setCharTimeline(mockCharacter, mockCamera);

            // Verify character rotation animations are preserved
            const timeline = gsap.timeline();
            expect(timeline.fromTo).toHaveBeenCalled();
            expect(timeline.to).toHaveBeenCalled();

            // Verify camera position animations
            const toCalls = timeline.to.mock.calls;
            expect(toCalls.some(call =>
                call[0] === mockCamera.position && call[1].z === 22
            )).toBe(true);
        });
    });

    describe('SplitText Migration - Functionality and Performance', () => {
        it('should use standard SplitText import and maintain exact configuration', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });

            setSplitText();

            // Verify SplitText uses standard import (not gsap-trial)
            expect(SplitText).toHaveBeenCalled();

            // Verify exact configuration for paragraphs
            expect(SplitText).toHaveBeenCalledWith(
                expect.any(Element),
                {
                    type: 'lines,words',
                    linesClass: 'split-line'
                }
            );

            // Verify exact configuration for titles
            expect(SplitText).toHaveBeenCalledWith(
                expect.any(Element),
                {
                    type: 'chars,lines',
                    linesClass: 'split-line'
                }
            );
        });

        it('should maintain mobile breakpoint behavior at 900px', () => {
            // Test mobile behavior (below 900px)
            Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true });

            setSplitText();

            // SplitText should not be called on mobile (maintains original behavior)
            expect(SplitText).not.toHaveBeenCalled();

            // Test desktop behavior (900px and above)
            Object.defineProperty(window, 'innerWidth', { value: 900, configurable: true });
            vi.clearAllMocks();

            setSplitText();

            // SplitText should be called at exactly 900px
            expect(SplitText).toHaveBeenCalled();
        });

        it('should preserve ScrollTrigger configuration and refresh behavior', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });

            setSplitText();

            // Verify ScrollTrigger configuration is maintained
            expect(ScrollTrigger.config).toHaveBeenCalledWith({ ignoreMobileResize: true });

            // Verify refresh event listener is added
            expect(ScrollTrigger.addEventListener).toHaveBeenCalledWith('refresh', expect.any(Function));
        });

        it('should maintain animation cleanup and performance optimization', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });

            // Add existing animations to test cleanup
            const para = document.querySelector('.para');
            const title = document.querySelector('.title');

            para.anim = {
                progress: vi.fn().mockReturnThis(),
                kill: vi.fn()
            };
            para.split = {
                revert: vi.fn()
            };

            title.anim = {
                progress: vi.fn().mockReturnThis(),
                kill: vi.fn()
            };
            title.split = {
                revert: vi.fn()
            };

            setSplitText();

            // Verify proper cleanup sequence
            expect(para.anim.progress).toHaveBeenCalledWith(1);
            expect(para.anim.kill).toHaveBeenCalled();
            expect(para.split.revert).toHaveBeenCalled();

            expect(title.anim.progress).toHaveBeenCalledWith(1);
            expect(title.anim.kill).toHaveBeenCalled();
            expect(title.split.revert).toHaveBeenCalled();
        });

        it('should maintain exact animation timing and stagger values', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });

            setSplitText();

            // Verify paragraph animation timing
            expect(gsap.fromTo).toHaveBeenCalledWith(
                expect.any(Array),
                { autoAlpha: 0, y: 80 },
                expect.objectContaining({
                    autoAlpha: 1,
                    duration: 1,
                    ease: 'power3.out',
                    y: 0,
                    stagger: 0.02,
                })
            );

            // Verify title animation timing
            expect(gsap.fromTo).toHaveBeenCalledWith(
                expect.any(Array),
                { autoAlpha: 0, y: 80, rotate: 10 },
                expect.objectContaining({
                    autoAlpha: 1,
                    duration: 0.8,
                    ease: 'power2.inOut',
                    y: 0,
                    rotate: 0,
                    stagger: 0.03,
                })
            );
        });

        it('should maintain responsive trigger start positions', () => {
            // Test desktop trigger start
            Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });

            setSplitText();

            // Verify desktop trigger start (20% 60%)
            expect(gsap.fromTo).toHaveBeenCalledWith(
                expect.any(Array),
                expect.any(Object),
                expect.objectContaining({
                    scrollTrigger: expect.objectContaining({
                        start: '20% 60%'
                    })
                })
            );

            // Test tablet trigger start
            Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
            vi.clearAllMocks();

            setSplitText();

            // Verify tablet trigger start (top 60%)
            expect(gsap.fromTo).toHaveBeenCalledWith(
                expect.any(Array),
                expect.any(Object),
                expect.objectContaining({
                    scrollTrigger: expect.objectContaining({
                        start: 'top 60%'
                    })
                })
            );
        });
    });

    describe('Initial Effects Functionality', () => {
        it('should initialize landing page animations correctly', () => {
            // Mock smoother object
            const mockSmoother = {
                paused: vi.fn()
            };

            // Mock the smoother import
            vi.doMock('../Navbar', () => ({
                smoother: mockSmoother
            }));

            initialFX();

            // Verify SplitText initialization for landing elements
            expect(SplitText).toHaveBeenCalledWith(
                ['.landing-info h3', '.landing-intro h2', '.landing-intro h1'],
                {
                    type: 'chars,lines',
                    linesClass: 'split-line'
                }
            );

            // Verify GSAP animations are called
            expect(gsap.fromTo).toHaveBeenCalled();
            expect(gsap.to).toHaveBeenCalledWith('body', {
                backgroundColor: '#0b080c',
                duration: 0.5,
                delay: 1,
            });
        });

        it('should handle multiple SplitText instances for different elements', () => {
            initialFX();

            // Verify multiple SplitText calls for different text elements
            const splitTextCalls = SplitText.mock.calls;
            expect(splitTextCalls.length).toBeGreaterThan(1);

            // Check that different selectors are used
            const selectors = splitTextCalls.map(call => call[0]);
            expect(selectors).toContain('.landing-h2-info');
            expect(selectors).toContain('.landing-h2-info-1');
        });
    });

    describe('Performance and Error Handling', () => {
        it('should handle missing DOM elements gracefully', () => {
            // Clear DOM
            document.body.innerHTML = '<main></main>';

            expect(() => {
                setSplitText();
                setAllTimeline();
                initialFX();
            }).not.toThrow();
        });

        it('should handle character object without expected children', () => {
            const mockCharacter = {
                children: [],
                rotation: { y: 0, x: 0 },
                getObjectByName: vi.fn(() => null)
            };
            const mockCamera = { position: { z: 20, y: 0 } };

            expect(() => {
                setCharTimeline(mockCharacter, mockCamera);
            }).not.toThrow();
        });

        it('should maintain animation performance with proper cleanup', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });

            // Create multiple elements with existing animations
            const elements = document.querySelectorAll('.para, .title');
            elements.forEach(el => {
                el.anim = {
                    progress: vi.fn().mockReturnThis(),
                    kill: vi.fn()
                };
                el.split = {
                    revert: vi.fn()
                };
            });

            setSplitText();

            // Verify all animations were properly cleaned up
            elements.forEach(el => {
                if (el.anim) {
                    expect(el.anim.kill).toHaveBeenCalled();
                }
                if (el.split) {
                    expect(el.split.revert).toHaveBeenCalled();
                }
            });
        });

        it('should handle window resize events correctly', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });

            setSplitText();

            // Verify ScrollTrigger refresh listener is added
            expect(ScrollTrigger.addEventListener).toHaveBeenCalledWith('refresh', expect.any(Function));
        });
    });

    describe('Animation Timing and Sequencing', () => {
        it('should maintain proper animation delays and durations', () => {
            initialFX();

            // Check that animations have proper timing
            const gsapCalls = gsap.fromTo.mock.calls;
            expect(gsapCalls.some(call =>
                call[2] && call[2].delay !== undefined
            )).toBe(true);

            expect(gsapCalls.some(call =>
                call[2] && call[2].duration !== undefined
            )).toBe(true);
        });

        it('should create proper stagger effects for text animations', () => {
            Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });

            setSplitText();

            // Verify stagger is used in animations
            const gsapCalls = gsap.fromTo.mock.calls;
            expect(gsapCalls.some(call =>
                call[2] && call[2].stagger !== undefined
            )).toBe(true);
        });
    });
});