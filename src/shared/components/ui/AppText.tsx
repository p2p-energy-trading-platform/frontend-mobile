import { PropsWithChildren } from 'react';
import { Text, TextProps } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

type Variant =
    | 'display'
    | 'heading'
    | 'title'
    | 'body'
    | 'caption';

interface AppTextProps extends PropsWithChildren, TextProps {
    variant?: Variant;
}

export function AppText({
    children,
    variant = 'body',
    style,
    ...props
}: AppTextProps) {
    const { theme } = useTheme();
    
    const classes = {
        display: 'text-4xl font-extrabold',
        heading: 'text-3xl font-bold',
        title: 'text-xl font-bold',
        body: 'text-base',
        caption: 'text-sm',
    };

    return (
        <Text
            className={classes[variant]}
            style={[
                {
                    color: theme.text,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
}