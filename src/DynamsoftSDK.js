import React from 'react';
import Dynamsoft from 'dwt';

export default class DWT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scanners: [],
            currentScanner: "Looking for devices.."
        };
    }
    DWObject = null;
    containerId = 'dwtcontrolContainer';
    width = "100%";
    height = "600";
    componentDidMount() {
        Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => {
            this.DWObject = Dynamsoft.DWT.GetWebTwain(this.containerId);
            if (this.DWObject) {
                let vCount = this.DWObject.SourceCount;
                let sourceNames = [];
                for (let i = 0; i < vCount; i++)
                    sourceNames.push(this.DWObject.GetSourceNameItems(i));
                this.setState({ scanners: sourceNames });
            }
        });
        this.loadDWT();
    }
    loadDWT() {
         /** v17.1 LICENSE ALERT - README
		 * The library requires a license to work, the APIs organizationID and handshakeCode specify how to acquire a license.
		 * If nothing is specified, a 7-day (public) trial license will be used by default which is the case in this sample.
		 * Note that network connection is required for this license to work.
		 */

		/* When using your own license, please uncomment the following lines and fill in your own information. */
		/* For more information, please refer to https://www.dynamsoft.com/license-tracking/docs/about/licensefaq.html?ver=latest#how-to-use-a-trackable-license. */

		// Dynamsoft.DWT.organizationID = "YOUR-ORGANIZATION-ID";
		// Dynamsoft.DWT.handshakeCode = "A-SPECIFIC-HANDSHAKECODE";
		// Dynamsoft.DWT.sessionPassword = "PASSWORD-TO-PROTECT-YOUR-LICENSE"; // Important field to protect your license.
		// Dynamsoft.DWT.licenseServer = ["YOUR-OWN-MAIN-LTS", "YOUR-OWN-STANDBY-LTS"]; // Ignore this line if you are using Dynamsoft-hosting LTS

		/* The API "ProductKey" is an alternative way to license the library, the major difference is that it does not require a network. Contact support@dynamsoft.com for more information. */

		// Dynamsoft.DWT.ProductKey = "YOUR-PRODUCT-KEY";

		/** LICENSE ALERT - THE END */
		
        Dynamsoft.DWT.ResourcesPath = "dwt-resources";
        Dynamsoft.DWT.Containers = [{ ContainerId: this.containerId, Width: this.width, Height: this.height }];
        let checkScriptLoaded = () => {
            if (Dynamsoft.Lib.detect.scriptLoaded) {
                this.modulizeInstallJS();
                Dynamsoft.DWT.Load();
            } else {
                setTimeout(() => {
                    checkScriptLoaded();
                }, 1000);
            }
        };
        checkScriptLoaded();
    }
    onSourceChange(value) {
        this.setState({ currentScanner: value });
    }
    acquireImage() {
        this.DWObject.CloseSource();
        for (let i = 0; i < this.DWObject.SourceCount; i++) {
            if (this.DWObject.GetSourceNameItems(i) === this.state.currentScanner) {
                this.DWObject.SelectSourceByIndex(i);
                break;
            }
        }
        this.DWObject.OpenSource();
        this.DWObject.AcquireImage();
    }
    loadImagesOrPDFs() {
        this.DWObject.IfShowFileDialog = true;
        this.DWObject.Addon.PDF.SetResolution(200);
        this.DWObject.Addon.PDF.SetConvertMode(1/*Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL*/);
        this.DWObject.LoadImageEx("", 5 /*Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL*/,
            () => { },
            (errorCode, errorString) => alert(errorString));
    }
    render() {
        return (
            <div style={{ width: "30%", margin: "0 auto" }}>
                <select style={{ width: "100%" }} tabIndex="1" value={this.state.currentScanner} onChange={(e) => this.onSourceChange(e.target.value)}>
                    {
                        this.state.scanners.length > 0 ?
                            this.state.scanners.map((_name, _index) =>
                                <option value={_name} key={_index}>{_name}</option>
                            )
                            :
                            <option value="Looking for devices..">Looking for devices..</option>
                    }
                </select>
                <button tabIndex="2" style={{ marginRight: "4%", width: "48%" }}
                    onClick={() => this.acquireImage()}
                    disabled={this.state.scanners.length > 0 ? "" : "disabled"}
                >Scan</button>
                <button tabIndex="3" style={{ margin: "2% 0", width: "48%" }}
                    onClick={() => this.loadImagesOrPDFs()}
                >Load</button>
                <div id={this.containerId}></div>
            </div >
        );
    }
    modulizeInstallJS() {
        let _DWT_Reconnect = Dynamsoft.DWT_Reconnect;
        Dynamsoft.DWT_Reconnect = (...args) => _DWT_Reconnect.call({ Dynamsoft: Dynamsoft }, ...args);
        let __show_install_dialog = Dynamsoft._show_install_dialog;
        Dynamsoft._show_install_dialog = (...args) => __show_install_dialog.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTwainOldPluginNotAllowedCallback = Dynamsoft.OnWebTwainOldPluginNotAllowedCallback;
        Dynamsoft.OnWebTwainOldPluginNotAllowedCallback = (...args) => _OnWebTwainOldPluginNotAllowedCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTwainNeedUpgradeCallback = Dynamsoft.OnWebTwainNeedUpgradeCallback;
        Dynamsoft.OnWebTwainNeedUpgradeCallback = (...args) => _OnWebTwainNeedUpgradeCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTwainPreExecuteCallback = Dynamsoft.OnWebTwainPreExecuteCallback;
        Dynamsoft.OnWebTwainPreExecuteCallback = (...args) => _OnWebTwainPreExecuteCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTwainPostExecuteCallback = Dynamsoft.OnWebTwainPostExecuteCallback;
        Dynamsoft.OnWebTwainPostExecuteCallback = (...args) => _OnWebTwainPostExecuteCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnRemoteWebTwainNotFoundCallback = Dynamsoft.OnRemoteWebTwainNotFoundCallback;
        Dynamsoft.OnRemoteWebTwainNotFoundCallback = (...args) => _OnRemoteWebTwainNotFoundCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnRemoteWebTwainNeedUpgradeCallback = Dynamsoft.OnRemoteWebTwainNeedUpgradeCallback;
        Dynamsoft.OnRemoteWebTwainNeedUpgradeCallback = (...args) => _OnRemoteWebTwainNeedUpgradeCallback.call({ Dynamsoft: Dynamsoft }, ...args);
        let _OnWebTWAINDllDownloadFailure = Dynamsoft.OnWebTWAINDllDownloadFailure;
        Dynamsoft.OnWebTWAINDllDownloadFailure = (...args) => _OnWebTWAINDllDownloadFailure.call({ Dynamsoft: Dynamsoft }, ...args);
    }
}
