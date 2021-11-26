const { createStitches } = require('@stitches/react');
import type * as Stitches from '@stitches/react';

export const { css, styled, config } = createStitches({  });
export type CSS = Stitches.CSS<typeof config>;
