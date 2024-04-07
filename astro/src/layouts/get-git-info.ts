import {execSync} from 'node:child_process';

export function getGitInfo() {
    try {
        execSync('git update-index --refresh');
    } catch (error) { }

    const result = execSync('git describe --tags --dirty --broken').toString().trim();
    return Promise.resolve(`${result}`);
}