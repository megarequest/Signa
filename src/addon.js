import { location } from './location.js';
import { createRouter } from './router.js';

const Plainly = window.Plainly;

Plainly.location = Plainly.ctx.location = location;
Plainly.router = createRouter;
