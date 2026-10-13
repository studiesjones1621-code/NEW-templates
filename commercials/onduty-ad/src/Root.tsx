import React from "react";
import { Composition } from "remotion";
import { OnDutyAd, TOTAL } from "./Ad";

export const RemotionRoot: React.FC = () => (
  <Composition id="OnDutyAd" component={OnDutyAd} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
