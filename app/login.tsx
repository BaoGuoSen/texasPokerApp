import { useMemo, useState } from 'react';
import { ImageBackground } from 'expo-image';
import { View, Image, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/text';
import { CheckIcon } from '@/components/ui/icon';
import { themeConfig } from '@/constants/ThemeConfig';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputSlot, InputField } from '@/components/ui/input';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxLabel,
  CheckboxIndicator
} from '@/components/ui/checkbox';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const disableSender = useMemo(() => {
    return phone.length !== 11;
  }, [phone]);

  return (
    <ImageBackground source={themeConfig.gameBackImg} contentFit="cover">
      {/* <GluestackUIProvider>

      </GluestackUIProvider> */}
      <View style={styles.container} className="bg-yellow-100 dark:bg-black">
        {/* 左边的表单区域 */}
        <View className="pt-6 pr-7 basis-[35%]">
          <Text size="4xl" bold className="mb-5">
            Texas Poker
          </Text>

          <Text size="md" bold>
            Mobile Phone
          </Text>
          <Input variant="underlined" size="md">
            <InputField
              placeholder="188 **** ****"
              onChangeText={setPhone}
              value={phone}
            />
            <InputSlot>
              <Button variant="link">
                <ButtonText disabled={disableSender}>Send Code</ButtonText>
              </Button>
            </InputSlot>
          </Input>

          <Text size="md" bold className="mt-5">
            Verify Code
          </Text>
          <Input variant="underlined" size="md">
            <InputField
              placeholder="Enter the sms code"
              value={smsCode}
              onChangeText={setSmsCode}
            />
          </Input>

          <Button size="md" variant="outline" action="primary" className="mt-8">
            <ButtonText action="primary">Login</ButtonText>
          </Button>

          <Checkbox
            size="md"
            isInvalid={false}
            isDisabled={false}
            value="protocol"
            className="mt-4"
            onChange={setAgreed}
            isChecked={agreed}
          >
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>
              <Text>Agree Protocol xxx</Text>
            </CheckboxLabel>
          </Checkbox>
          <Text size="sm" className="mt-2">
            If you do not have an account, you will be automatically registered.
          </Text>
        </View>

        <View className="basis-1/2 overflow-hidden rounded-xl">
          <Image
            style={styles.image}
            src="https://cos.wishufree.com/images/compressed/nassrinart_7-mQnSWGqjYTM-unsplash%281%29__40fb77c3-6743-40c8-9320-10c8aae51e52.jpg"
          />
        </View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: '10%',
    paddingVertical: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  text: {
    color: '#fff'
  },
  image: {
    objectFit: 'cover',
    height: '100%'
  },
  title: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 22
  }
});
