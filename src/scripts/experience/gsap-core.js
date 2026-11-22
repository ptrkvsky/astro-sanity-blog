// Instance GSAP unique, partagée par la home et /cv. Chaque page enregistre ensuite ses propres plugins.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
