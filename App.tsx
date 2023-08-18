/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import axios from 'axios';
import {GITHUB_TOKEN} from '@env';

import {
  Colors,
  Header,
  LearnMoreLinks,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const customAxios = axios.create({
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
  },
});

interface IUserInfo {
  name: string;
  avatar_url: string;
}

const getGithubUser = async (username: string) => {
  try {
    // https://api.github.com/users/
    const URL = 'https://api.github.com/users/';

    const res = await customAxios.get<IUserInfo>(`${URL}${username}`);

    return res.data;
  } catch (error: any) {
    console.error(error.message);
  }
};

const UserSearchForm = () => {
  const [username, setUserName] = React.useState('');
  const [userInfo, setUserInfo] = React.useState<IUserInfo>();

  const getUser = async (username: string) => {
    const user = await getGithubUser(username);

    if (!user) {
      Alert.alert('사용자를 찾을 수 없습니다.');
      return;
    }

    setUserInfo(user);
    setUserName('');
  };

  const handleChangeText = useCallback((text: string) => {
    setUserName(text);
  }, []);

  const handlePress = useCallback(() => {
    if (!username) {
      Alert.alert('유저 이름을 입력하세요');
      return;
    }
    getUser(username);
  }, [username]);

  return (
    <View style={styles.searchForm}>
      {userInfo && (
        <View>
          <Image
            source={{
              uri: userInfo.avatar_url,
            }}
            style={{width: 150, height: 150}}
          />
          <Text>{userInfo.name}</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="사용자 이름을 검색하세요"
        value={username}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={handleChangeText}
      />
      <Button onPress={handlePress} title="Search" />
    </View>
  );
};

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <UserSearchForm />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Info">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            <Text>Hello React Native Cli World!</Text>
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 50,
    borderRadius: 5,
    padding: 5,
  },
  searchForm: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
