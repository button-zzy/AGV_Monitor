// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain  , globalShortcut } = require('electron')
const path = require('node:path')

let mainWindow

// 登录窗口的参数
let loginWindowParams = {
    width: 500,
    height: 600,
    minWidth: 500,
    minHeight: 600,
    frame: true,
    resizable: false,
    fullscreen: false
}
function createWindow(params){
    // 如果已有窗口，先关闭它
    if (mainWindow) {
        mainWindow.close();
    }
    // 创建新窗口
    mainWindow = new BrowserWindow({
        width: params.width,
        height: params.height,
        minWidth: params.minWidth,
        minHeight: params.minHeight,
        title: '沧源智业',
        icon: path.join(__dirname, './icon.png'), // 设置图标路径
        autoHideMenuBar: true, // 启用自动隐藏菜单栏
        frame: params.frame, // 隐藏窗口的顶部框（标题栏）
        resizable: params.resizable, // 可选，是否允许改变窗口大小
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        kiosk: false
    })

    // 强制隐藏菜单栏并阻止显示
    mainWindow.setMenuBarVisibility(false);

    // 监听所有的 keydown 事件
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'Alt') {
            event.preventDefault(); // 阻止 Alt 键默认行为
        }
    });

    // 加载 index.html
    mainWindow.loadFile(path.join(__dirname, '../', 'dist', 'index.html'));


    // 启动时最大化窗口
    if (params.fullscreen) {
        mainWindow.maximize();
    }

    // 默认打开开发工具
    // mainWindow.webContents.openDevTools()

    // 当窗口获得焦点时，注册关闭窗口的快捷键
    mainWindow.on('focus', () => {
        globalShortcut.register('Control+f4', () => {
            mainWindow.close();
        });
    });

    // 当窗口失去焦点时，注销关闭窗口的快捷键
    mainWindow.on('blur', () => {
        globalShortcut.unregister('Control+f4');
    });

}

// 这段程序将会在 Electron 结束初始化和创建浏览器窗口的时候调用,部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    createWindow(loginWindowParams)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow(loginWindowParams)
    })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。

// 监听登录成功事件
ipcMain.on('login-success', () => {
    // 登陆成功窗口最大化
    mainWindow.maximize()
    mainWindow.setResizable(true)
    // 动态设置最小尺寸
    mainWindow.setMinimumSize(1050, 770);
});
// 监听注销事件
ipcMain.on('logout-success', () => {
    mainWindow.setSize( 500, 600)
});


ipcMain.on('close-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window.close();
});
