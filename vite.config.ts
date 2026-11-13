import { defineConfig } from 'vite';
import {execFileSync} from 'node:child_process';
// ZIP downloads and GitHub Desktop clones may not have git on the shell PATH.
function localRevision(){try{return execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{return 'local';}}
const buildId=(process.env.GITHUB_SHA||localRevision()).slice(0,7);
export default defineConfig({ base: './',define:{__BUILD_ID__:JSON.stringify(buildId)} });
