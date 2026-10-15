import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(() => cleanup());
if (typeof Element !== "undefined") Element.prototype.scrollIntoView = () => {};
if (typeof window !== "undefined") window.scrollTo = () => {};
// jsdom does not implement the browser's dialog methods.
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
}
