export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

export const FontFamily = {
  heading: 'PlusJakartaSans_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  mono: 'RobotoMono_700Bold',
} as const;

/**
 * Ready-made text styles: font family + size + line height in one place.
 * Spread or pass these as `style` instead of writing fontSize / lineHeight / fontFamily inline.
 * Colour is not part of a text style: set it from the theme (`theme.text`, `theme.textSecondary`, ...).
 *
 * 12 / 13 / 15 / 28 are not on the `Typography.fontSize` scale: they come from the Figma designs.
 */
export const TextStyles = {
  /** Screen title, e.g. "Welcome back". */
  title: { fontFamily: FontFamily.heading, fontSize: 28, lineHeight: 36 },

  /** Supporting text under a screen title. */
  subtitle: { fontFamily: FontFamily.body, fontSize: 15, lineHeight: 22 },

  /** Text typed into an input. */
  input: {
    fontFamily: FontFamily.body,
    fontSize: Typography.fontSize.md,
    lineHeight: Typography.lineHeight.md,
  },

  /** One digit of a verification code. */
  otpDigit: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: Typography.fontSize.xl,
    lineHeight: Typography.lineHeight.lg,
  },

  /** Regular small text, e.g. "Already have an account?". */
  body: {
    fontFamily: FontFamily.body,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
  },

  /** Emphasised small text: inline links. */
  bodySemibold: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
  },

  /** Small text that wraps over several lines, e.g. a checkbox label. */
  bodyRelaxed: { fontFamily: FontFamily.body, fontSize: Typography.fontSize.sm, lineHeight: 22 },

  /** Field label and small links. */
  label: { fontFamily: FontFamily.bodySemibold, fontSize: 13, lineHeight: 18 },

  /** Quieter label, e.g. "Step 1 of 4". */
  labelMedium: { fontFamily: FontFamily.bodyMedium, fontSize: 13, lineHeight: 18 },

  /** Helper and error text under a field, small notes. */
  caption: {
    fontFamily: FontFamily.body,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs,
  },

  /** Caption with a bit more weight, e.g. the label inside a divider. */
  captionMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs,
  },

  /** Caption-sized inline link. */
  captionSemibold: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs,
  },

    /** Medium-weight small text, e.g. a quiet "Skip for now" link. */
  bodyMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
  },
  
} as const;
