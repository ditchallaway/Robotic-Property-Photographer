import 'cesium/Build/Cesium/Widgets/widgets.css';
import '../styles/globals.css';


if (typeof window !== 'undefined') {
    window.CESIUM_BASE_URL = '/cesium';
}

export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
