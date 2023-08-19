/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlexAlignType,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
    throw error;
  }
};

const UserSearchForm = () => {
  const [username, setUserName] = React.useState('');
  const [userInfo, setUserInfo] = React.useState<IUserInfo | null>(null);
  const [status, setStatus] = React.useState<
    'REQUEST' | 'SUCCESS' | 'FAILURE'
  >();

  const getUser = async (username: string) => {
    try {
      const user = await getGithubUser(username);

      if (!user) {
        throw new Error('Not Found User');
      }

      setStatus('SUCCESS');
      setUserInfo(user);
      setUserName('');
    } catch (error) {
      setStatus('FAILURE');
      setUserInfo(null);
    }
  };

  const handleChangeText = useCallback((text: string) => {
    setUserName(text);
  }, []);

  const handlePress = useCallback(() => {
    if (!username) {
      Alert.alert('유저 이름을 입력하세요');
      return;
    }

    setStatus('REQUEST');
    getUser(username);
  }, [username]);

  const profileView = React.useMemo(() => {
    if (status === 'REQUEST') {
      return <ActivityIndicator size="large" />;
    }

    if (!userInfo) {
      return <Text>Not Found</Text>;
    }

    return (
      <>
        <Image
          source={{
            uri: userInfo.avatar_url,
          }}
          style={{width: 150, height: 150}}
        />
        <Text>{userInfo.name}</Text>
      </>
    );
  }, [status, userInfo]);

  // 검색 -> 로딩 인디케이터 -> 찾음, 못찾음
  return (
    <View style={styles.searchForm}>
      {status && (
        <View
          style={{
            width: 150,
            height: 150,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {profileView}
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="사용자 이름을 검색하세요"
        value={username}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={handleChangeText}
        onSubmitEditing={handlePress}
      />
      <Button onPress={handlePress} title="Search" />
    </View>
  );
};

const FlexContainer = () => {
  return (
    <View style={[styles.container, {flexDirection: 'column', height: 100}]}>
      <View style={{flex: 1, backgroundColor: 'red'}} />
      <View style={{flex: 2, backgroundColor: 'blue'}} />
      <View style={{flex: 3, backgroundColor: 'yellow'}} />
    </View>
  );
};

// const FlexDirectionBasics = () => {
//   const [flexDirection, setFlexDirection] = useState('column');
//   const [direction, setDirection] = useState('ltr');
//   return (
//     <PreviewLayout
//       label="direction"
//       values={['ltr', 'rtl']}
//       selectedValue={direction}
//       setSelectedValue={setDirection}>
//       <View style={[styles.box, {backgroundColor: 'powderblue'}]} />
//       <View style={[styles.box, {backgroundColor: 'skyblue'}]} />
//       <View style={[styles.box, {backgroundColor: 'steelblue'}]} />
//     </PreviewLayout>
//   );
// };

const AlignSelfLayout = () => {
  const [alignSelf, setAlignSelf] = useState('stretch');

  return (
    <PreviewLayout
      label="alignSelf"
      selectedValue={alignSelf}
      values={['center', 'flex-start', 'flex-end', 'stretch', 'baseline']}
      setSelectedValue={setAlignSelf}>
      <View
        style={[
          styles.box,
          {
            alignSelf: alignSelf as FlexAlignType,
            width: 'auto',
            minWidth: 50,
            backgroundColor: 'powderblue',
          },
        ]}
      />
      <View style={[styles.box, {backgroundColor: 'skyblue'}]} />
      <View style={[styles.box, {backgroundColor: 'steelblue'}]} />
    </PreviewLayout>
  );
};

const AlignContentLayout = () => {
  const [alignContent, setAlignContent] = useState('flex-start');

  return (
    <PreviewLayout
      label="alignContent"
      selectedValue={alignContent}
      values={[
        'flex-start',
        'flex-end',
        'stretch',
        'center',
        'space-between',
        'space-around',
      ]}
      setSelectedValue={setAlignContent}>
      <View style={[styles.box, {backgroundColor: 'orangered'}]} />
      <View style={[styles.box, {backgroundColor: 'orange'}]} />
      <View style={[styles.box, {backgroundColor: 'mediumseagreen'}]} />
      <View style={[styles.box, {backgroundColor: 'deepskyblue'}]} />
      <View style={[styles.box, {backgroundColor: 'mediumturquoise'}]} />
      <View style={[styles.box, {backgroundColor: 'mediumslateblue'}]} />
      <View style={[styles.box, {backgroundColor: 'purple'}]} />
    </PreviewLayout>
  );
};

interface PreviewLayoutProps {
  label: string;
  values: string[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

const PreviewLayout = ({
  label,
  children,
  values,
  selectedValue,
  setSelectedValue,
}: PropsWithChildren<PreviewLayoutProps>) => {
  return (
    <View style={{padding: 10, flex: 1}}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {values.map(value => (
          <TouchableOpacity
            key={value}
            onPress={() => setSelectedValue(value)}
            style={[styles.button, selectedValue === value && styles.selected]}>
            <Text
              style={[
                styles.buttonLabel,
                selectedValue === value && styles.selectedLabel,
              ]}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.container}>{children}</View>
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
      <View
        style={{
          flexDirection: 'column',
          height: '100%',
        }}>
        <View style={{flex: 1}}>
          <FlexContainer />
        </View>
        <View style={{flex: 2}}>
          {/* <FlexDirectionBasics /> */}
          <AlignSelfLayout />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: 'aliceblue',
  },
  box: {
    width: 50,
    height: 50,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'coral',
  },
  selectedLabel: {
    color: '#fff',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
});

export default App;
