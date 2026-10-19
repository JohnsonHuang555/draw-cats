import { AlbumStore } from './albumStore';
import { Sfx } from './audio/sfx';
import { Director } from './director';
import { Input } from './input';
import { Stage } from './scene/stage';
import { Overlay } from './ui/overlay';

const canvas = document.querySelector<HTMLCanvasElement>('#stage')!;
const uiRoot = document.querySelector<HTMLElement>('#ui')!;

const stage = new Stage(canvas);
const input = new Input(canvas);
const sfx = new Sfx();
const showDev = import.meta.env.DEV || new URLSearchParams(location.search).has('dev');
const overlay = new Overlay(uiRoot, sfx.muted, showDev);

new Director(stage, input, overlay, sfx, new AlbumStore());
