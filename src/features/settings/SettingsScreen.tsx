import { useState } from 'react';
import { Image, Pressable, ScrollView, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ChevronDown, Lock } from 'lucide-react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Icon, type IconName } from '@/shared/components/ui/Icon';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type StatusTone = 'success' | 'info';

const accountItems: {
  title: string;
  status: string;
  hint: string;
  icon: IconName;
  tone: StatusTone;
}[] = [
  {
    title: 'Email',
    status: 'Verified',
    hint: 'Ready for sign-in',
    icon: 'mark-email-unread',
    tone: 'success',
  },
  {
    title: 'Identity / KYC',
    status: 'Approved',
    hint: 'Identity confirmed',
    icon: 'shield-check',
    tone: 'success',
  },
  {
    title: 'Payment method',
    status: 'Card + bank added',
    hint: 'Ready to transact',
    icon: 'account-balance-wallet',
    tone: 'success',
  },
  {
    title: 'Smart meter',
    status: 'Online · SM-784',
    hint: 'Last synced just now',
    icon: 'sensors',
    tone: 'info',
  },
];

const profileValues: { label: string; value: string; locked?: boolean; action?: string }[] = [
  { label: 'Legal name', value: 'Aisha Mariam Al-Zaabi', locked: true },
  { label: 'Date of birth', value: '14 March 2003', locked: true },
  { label: 'Nationality', value: 'United Arab Emirates', locked: true },
  { label: 'Email', value: 'aisha.alzaabi@example.com', action: 'Change' },
  { label: 'Mobile', value: '+971 50 123 4567', action: 'Change' },
  { label: 'Residential address', value: 'Dubai South, Dubai', action: 'Edit' },
  { label: 'Emirate', value: 'Dubai' },
];

export default function SettingsScreen() {
  const { theme } = useTheme();
  const [displayName, setDisplayName] = useState('Aisha Al-Zaabi');
  const [draftName, setDraftName] = useState(displayName);
  const [editingName, setEditingName] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string>();
  const [sectionOpen, setSectionOpen] = useState(false);

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled) setAvatarUri(result.assets[0]?.uri);
  };

  const saveName = () => {
    const nextName = draftName.trim();
    if (nextName) setDisplayName(nextName);
    setEditingName(false);
  };

  const statusColor = (tone: StatusTone) =>
    tone === 'success' ? theme.success : theme.feedback.info.icon;

  return (
    <AppShell initials="AA">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4 px-4 pb-8 pt-4"
      >
        <PageHeader title="Settings" subtitle="Account, security, and preferences" />

        <Card className="rounded-2xl">
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <AppText style={{ fontSize: 15, fontWeight: '700' }}>Account readiness</AppText>
              <AppText style={{ color: theme.success, fontSize: 12, fontWeight: '700' }}>
                4 of 4 ready
              </AppText>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {accountItems.map((item) => (
                <View
                  key={item.title}
                  className="w-[48%] flex-1 gap-2 rounded-xl border p-3"
                  style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
                >
                  <View className="flex-row items-center gap-2">
                    <Icon name={item.icon} size={16} color={statusColor(item.tone)} />
                    <AppText style={{ flexShrink: 1, fontSize: 11, color: theme.textSecondary }}>
                      {item.title}
                    </AppText>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <View
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: statusColor(item.tone) }}
                    />
                    <AppText
                      style={{
                        flexShrink: 1,
                        fontSize: 12,
                        fontWeight: '700',
                        color: statusColor(item.tone),
                      }}
                    >
                      {item.status}
                    </AppText>
                  </View>
                  <AppText style={{ fontSize: 10, color: theme.textTertiary }}>{item.hint}</AppText>
                </View>
              ))}
            </View>
          </View>
        </Card>

        <View className="gap-2">
          <AppText
            style={{
              marginLeft: 4,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 1,
              color: theme.textTertiary,
            }}
          >
            SECTION
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings section: Profile"
            onPress={() => setSectionOpen((open) => !open)}
            className="h-12 flex-row items-center justify-between rounded-xl border px-4"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <View className="flex-row items-center gap-3">
              <Icon name="person" size={18} color={theme.accent} />
              <AppText style={{ fontWeight: '600' }}>Profile</AppText>
            </View>
            <ChevronDown size={18} color={theme.textSecondary} />
          </Pressable>
          {sectionOpen ? (
            <View
              className="gap-1 rounded-xl border p-2"
              style={{ backgroundColor: theme.surface, borderColor: theme.border }}
            >
              <AppText
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  color: theme.accent,
                  fontWeight: '600',
                }}
              >
                Profile
              </AppText>
              {['Security', 'Notifications', 'Preferences'].map((option) => (
                <AppText
                  key={option}
                  accessibilityState={{ disabled: true }}
                  style={{ paddingHorizontal: 10, paddingVertical: 8, color: theme.textDisabled }}
                >
                  {option} · Coming soon
                </AppText>
              ))}
            </View>
          ) : null}
        </View>

        <Card>
          <View className="items-center gap-2 py-1">
            <View
              className="relative h-24 w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: theme.surfaceSecondary }}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} className="h-24 w-24 rounded-full" />
              ) : (
                <AppText style={{ color: theme.accent, fontSize: 28, fontWeight: '700' }}>
                  AA
                </AppText>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Take or choose a profile photo"
                onPress={pickPhoto}
                className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full border-2"
                style={{ backgroundColor: theme.accent, borderColor: theme.surface }}
              >
                <Icon name="camera" size={16} color={theme.accentForeground} />
              </Pressable>
            </View>
            <AppText style={{ fontSize: 18, fontWeight: '700' }}>{displayName}</AppText>
            <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>
              Member since June 2025
            </AppText>
            <Pressable accessibilityRole="button" onPress={pickPhoto} className="py-1">
              <AppText style={{ color: theme.accent, fontSize: 13, fontWeight: '600' }}>
                Upload photo
              </AppText>
            </Pressable>
          </View>
        </Card>

        <Card>
          <View className="gap-3">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 gap-1">
                <AppText style={{ fontSize: 15, fontWeight: '700' }}>Display name</AppText>
                <AppText style={{ color: theme.textSecondary, fontSize: 12, lineHeight: 18 }}>
                  This is how your name appears to other GridX participants.
                </AppText>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setDraftName(displayName);
                  setEditingName((editing) => !editing);
                }}
                className="rounded-lg px-3 py-2"
                style={{ backgroundColor: theme.surfaceAlt }}
              >
                <AppText style={{ color: theme.accent, fontWeight: '600' }}>
                  {editingName ? 'Cancel' : 'Edit'}
                </AppText>
              </Pressable>
            </View>
            {editingName ? (
              <View className="gap-2">
                <TextInput
                  accessibilityLabel="Display name"
                  value={draftName}
                  onChangeText={setDraftName}
                  className="rounded-xl border px-4 py-3"
                  style={{
                    color: theme.text,
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.borderInput,
                  }}
                />
                <Button title="Save name" variant="accent" onPress={saveName} />
              </View>
            ) : (
              <AppText style={{ fontSize: 14, fontWeight: '600' }}>{displayName}</AppText>
            )}
          </View>
        </Card>

        <Card>
          <View className="gap-4">
            <View className="gap-1">
              <AppText style={{ fontSize: 15, fontWeight: '700' }}>Personal details</AppText>
              <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>
                Your verified account information
              </AppText>
            </View>
            {profileValues.map((item, index) => (
              <View key={item.label}>
                {index > 0 ? (
                  <View className="mb-3 h-px" style={{ backgroundColor: theme.divider }} />
                ) : null}
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1 gap-1">
                    <AppText style={{ color: theme.textSecondary, fontSize: 11 }}>
                      {item.label}
                    </AppText>
                    <AppText style={{ fontSize: 13, fontWeight: '500' }}>{item.value}</AppText>
                    {item.locked ? (
                      <View className="flex-row items-center gap-1">
                        <Lock size={11} color={theme.textTertiary} />
                        <AppText style={{ color: theme.textTertiary, fontSize: 10 }}>
                          Locked after KYC approval
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                  {item.action ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => undefined}
                      className="px-2 py-2"
                    >
                      <AppText style={{ color: theme.accent, fontSize: 12, fontWeight: '600' }}>
                        {item.action}
                      </AppText>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </AppShell>
  );
}
