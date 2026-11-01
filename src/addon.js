import { location } from './location.js';
import { createRouter } from './router.js';

const Signa = window.Signa;

Signa.location = Signa.ctx.location = location;
Signa.router = createRouter;
