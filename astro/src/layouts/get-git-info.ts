import {execSync} from 'node:child_process';

export function getGitInfo() {
    try {
        const tag = execSync('git describe --tags --exact --dirty --broken').toString().trim();
        return Promise.resolve(tag);
    } catch (error) {
        const result = execSync('git describe --tags --dirty --broken').toString().trim();
        const date = execSync('git show --no-patch --format=%ci').toString().trim()
        return Promise.resolve(`${result} @ ${date}`);
    }
}