import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      <StatusBar />
      <Slot initialRouteName="login" />
    </>
  );
}
