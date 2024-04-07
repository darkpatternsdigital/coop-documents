import {execSync} from 'node:child_process';

export function getGitInfo() {
    const hasChanges = execSync('git status --porcelain').toString().trim();
    const result = execSync('git rev-parse --short HEAD').toString().trim();
    if (hasChanges) {
        return Promise.resolve(`local changes on ${result}`);
    }
    const date = execSync('git show --no-patch --format=%ci').toString().trim()
    return Promise.resolve(`${result} @ ${date}`);
}