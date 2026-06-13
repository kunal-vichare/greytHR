import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { COLORS } from '../../Constants/colors';
import { STRINGS } from '../../Constants/strings';
import { registerEmployee } from '../../redux/slices/authSlice';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const EmployeeRegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [designation, setDesignation] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let valid = true;
    let tempErrors = {};

    if (!fullName) {
      tempErrors.fullName = STRINGS.requiredError;
      valid = false;
    }
    if (!email) {
      tempErrors.email = STRINGS.requiredError;
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = STRINGS.invalidEmail;
      valid = false;
    }
    if (!password) {
      tempErrors.password = STRINGS.requiredError;
      valid = false;
    } else if (password.length < 6) {
      tempErrors.password = STRINGS.passwordLengthError;
      valid = false;
    }
    if (!companyId) {
      tempErrors.companyId = STRINGS.requiredError;
      valid = false;
    }
    if (!designation) {
      tempErrors.designation = STRINGS.requiredError;
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleRegister = () => {
    if (validate()) {
      dispatch(registerEmployee({ fullName, email, password, companyId, designation }))
        .unwrap()
        .then(() => {
          Alert.alert(
            'Registration Successful!',
            `You have registered under workspace ID: ${companyId.toUpperCase()}.\n\nYou can now sign in to your dashboard.`,
            [
              {
                text: 'Go to Login',
                onPress: () => navigation.navigate('Login'),
              },
            ]
          );
        })
        .catch((error) => {
          Alert.alert('Registration Failed', error);
        });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{STRINGS.registerAsEmployee}</Text>
        <Text style={styles.subtitle}>Enter your details and Company ID to sync with your employer's workspace</Text>
      </View>

      <View style={styles.form}>
        <Input
          label={STRINGS.fullNameLabel}
          placeholder={STRINGS.fullNamePlaceholder}
          value={fullName}
          onChangeText={setFullName}
          error={errors.fullName}
        />
        <Input
          label={STRINGS.emailLabel}
          placeholder={STRINGS.emailPlaceholder}
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
        />
        <Input
          label={STRINGS.passwordLabel}
          placeholder={STRINGS.passwordPlaceholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />
        <Input
          label={STRINGS.companyIdLabel}
          placeholder={STRINGS.companyIdPlaceholder}
          value={companyId}
          onChangeText={setCompanyId}
          error={errors.companyId}
          autoCapitalize="characters"
        />
        <Input
          label="Designation / Role"
          placeholder="e.g. Sales Officer, Systems Analyst"
          value={designation}
          onChangeText={setDesignation}
          error={errors.designation}
        />

        <Button
          title={STRINGS.registerEmployeeBtn}
          onPress={handleRegister}
          style={styles.submitBtn}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>{STRINGS.alreadyHaveAccount}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  form: {
    width: '100%',
  },
  submitBtn: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginRight: 6,
  },
  loginLink: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default EmployeeRegisterScreen;
