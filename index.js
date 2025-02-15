const core = require('@actions/core');
const io = require('@actions/io');
const tc = require('@actions/tool-cache');

const workspace = process.env.GITHUB_WORKSPACE;
const binDir = `${workspace}/bin`;

main().catch(error => {
    core.setFailed(error)
})

async function main() {
    switch (process.platform) {
        case 'win32':
            await installExecutable(binDir)
            break;
        case 'linux':
            await installZip(binDir, process.platform)
            break;
        case 'darwin':
            await installZip(binDir, 'mac')
            break;
        default:
            break;
    }

    await core.addPath(binDir)
}

async function downloadTool(platform) {
    const spectralDsn = core.getInput('spectral-dsn')
    const url = `${spectralDsn}/latest/dl/${platform}`
    return await tc.downloadTool(url);
}

async function installZip(path, platform) {
    await io.mkdirP(path);
    const downloadPath = await downloadTool(platform)
    await tc.extractTar(downloadPath, path)
}

async function installExecutable(path) {
    await io.mkdirP(path);
    const downloadPath = await downloadTool('exe')
    await io.mv(downloadPath, `${path}/spectral.exe`)
}