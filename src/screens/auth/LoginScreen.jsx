import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../Constants/colors';
import { STRINGS } from '../../Constants/strings';
import { AuthContext } from '../../Context/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const [role, setRole] = useState('employee'); // 'employee' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let valid = true;
    let tempErrors = {};

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

  const handleLogin = () => {
    if (validate()) {
      const result = login(email, password, role);
      if (result.success) {
        // Logged in! AppNavigation index will auto-redirect because state changes
      } else {
        Alert.alert('Authentication Failed', result.error || STRINGS.authFailed);
      }
    }
  };

  const navigateToRegister = () => {
    if (role === 'admin') {
      navigation.navigate('CompanyRegister');
    } else {
      navigation.navigate('EmployeeRegister');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.appName}>{STRINGS.appName}</Text>
        <Text style={styles.title}>{STRINGS.loginTitle}</Text>
        <Text style={styles.subtitle}>{STRINGS.loginSubtitle}</Text>
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>{STRINGS.selectRole}</Text>
        <View style={styles.roleTabs}>
          <TouchableOpacity
            style={[styles.roleTab, role === 'employee' ? styles.activeTab : null]}
            onPress={() => {
              setRole('employee');
              setErrors({});
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.roleTabText, role === 'employee' ? styles.activeTabText : null]}>
              {STRINGS.roleEmployee}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleTab, role === 'admin' ? styles.activeTab : null]}
            onPress={() => {
              setRole('admin');
              setErrors({});
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.roleTabText, role === 'admin' ? styles.activeTabText : null]}>
              {STRINGS.adminBadge}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.form}>
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
          title={STRINGS.loginBtn}
          onPress={handleLogin}
          style={styles.loginBtn}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>{STRINGS.noAccountYet}</Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={styles.registerLink}>
              {role === 'admin' ? STRINGS.registerCompanyBtn : STRINGS.registerEmployeeBtn}
            </Text>
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
    marginBottom: 32,
    marginTop: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primaryLight,
    letterSpacing: 1,
    marginBottom: 8,
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
    marginTop: 6,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  activeTabText: {
    color: COLORS.text,
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  loginBtn: {
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
  registerLink: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default LoginScreen;
