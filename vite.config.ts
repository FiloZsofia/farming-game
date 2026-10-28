import { defineConfig } from 'vite';
import {execFileSync} from 'node:child_process';
const buildId=(process.env.GITHUB_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()).slice(0,7);
export default defineConfig({ base: './',define:{__BUILD_ID__:JSON.stringify(buildId)} });
