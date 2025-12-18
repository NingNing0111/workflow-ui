// 

import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useAppAppearanceStore } from "~/stores/appearanceStore";

const ThemeTraggle = () => {
    const toggleTheme = useAppAppearanceStore(s => s.toggleTheme)
    const theme = useAppAppearanceStore(s => s.theme);

    return <Button icon={theme === 'dark' ? <MoonOutlined /> : <SunOutlined />} shape="circle" onClick={toggleTheme}></Button>
}


export default ThemeTraggle;