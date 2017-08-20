import * as yargs from 'yargs';

import zeplinProjectToJson from '.';

(async () => {
    const argv = yargs.parse(process.argv);
    const projectId = argv.pid || argv.projectId;
    const username = argv.id || argv.username;
    const password = argv.pw || argv.password;
    const headless =
        (argv.headless != null) ? argv.headless :
        (argv.noHeadless != null) ? !argv.noHeadless :
        true;
    if (!projectId) console.error('--pid=<project id> required'), process.exit(1);
    if (!username) console.error('--id=<username> required'), process.exit(2);
    if (!password) console.error('--pw=<password> required'), process.exit(3);
    console.log(JSON.stringify(await zeplinProjectToJson({
        projectId,
        login: {
            username,
            password,
        },
        headless,
    }), null, 2));
})();
