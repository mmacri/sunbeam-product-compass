
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Menubar } from "./MenubarRoot"
import { MenubarTrigger } from "./MenubarTrigger"
import { MenubarContent } from "./MenubarContent"
import { MenubarItem, MenubarCheckboxItem, MenubarRadioItem } from "./MenubarItems"
import { MenubarSubTrigger, MenubarSubContent } from "./MenubarSubComponents"
import { MenubarLabel, MenubarSeparator, MenubarShortcut } from "./MenubarUtilities"

const MenubarMenu = MenubarPrimitive.Menu
const MenubarGroup = MenubarPrimitive.Group
const MenubarPortal = MenubarPrimitive.Portal
const MenubarSub = MenubarPrimitive.Sub
const MenubarRadioGroup = MenubarPrimitive.RadioGroup

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
