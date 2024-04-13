import {execSync} from 'node:child_process';
import { format } from 'date-fns';

export function getGitInfo() {
    try {
        execSync('git update-index --refresh');
    } catch (error) { }

    const gitDescription = execSync('git describe --always --tags --dirty --broken').toString().trim();
    const unixTimestamp = Number(execSync('git show --no-patch --format=%ct HEAD').toString().trim());
    const date = new Date(unixTimestamp * 1000);
    return Promise.resolve(`Last update: ${format(date, "EEEE, do 'of' MMMM, yyyy 'at' h:mmaaa O")} (${gitDescription})`);
}