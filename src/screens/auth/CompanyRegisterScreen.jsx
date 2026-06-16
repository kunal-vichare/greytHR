import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../Constants/colors';
import { STRINGS } from '../../Constants/strings';
import { AuthContext } from '../../Context/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const CompanyRegisterScreen = () => {
  const navigation = useNavigation();
  const { registerCompany } = useContext(AuthContext);

  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let valid = true;
    let tempErrors = {};

    if (!companyName) {
      tempErrors.companyName = STRINGS.requiredError;
      valid = false;
    }
    if (!ownerName) {
      tempErrors.ownerName = STRINGS.requiredError;
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

    setErrors(tempErrors);
    return valid;
  };

  const handleRegister = () => {
    if (validate()) {
      const result = registerCompany(companyName, ownerName, email, password);
      if (result.success) {
        Alert.alert(
          'Registration Successful!',
          `Workspace for "${companyName}" has been created.\n\nYour Workspace Company ID is: ${result.companyId}\n\nEmployees must use this ID to register under your company.`,
          [
            {
              text: 'Go to Login',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        Alert.alert('Registration Failed', result.error);
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>{STRINGS.registerAsCompany}</Text>
        <Text style={styles.subtitle}>Register your organization to onboard your employees and monitor attendance</Text>
      </View>

      <View style={styles.form}>
        <Input
          label={STRINGS.companyNameLabel}
          placeholder={STRINGS.companyNamePlaceholder}
          value={companyName}
          onChangeText={setCompanyName}
          error={errors.companyName}
        />
        <Input
          label={STRINGS.fullNameLabel}
          placeholder="Owner full name"
          value={ownerName}
          onChangeText={setOwnerName}
          error={errors.ownerName}
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

        <Button
          title={STRINGS.registerCompanyBtn}
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

export default CompanyRegisterScreen;
