import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '../../Constants/colors';
import { STRINGS } from '../../Constants/strings';
import { addAnnouncementThunk } from '../../redux/slices/appSlice';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const AnnouncementsScreen = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const announcements = useSelector((state) => state.app.announcements);

  const isAdmin = currentUser?.role === 'admin';

  // Broadcast state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    let valid = true;
    let tempErrors = {};

    if (!title) {
      tempErrors.title = STRINGS.requiredError;
      valid = false;
    }
    if (!content) {
      tempErrors.content = STRINGS.requiredError;
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleBroadcast = () => {
    if (validate()) {
      dispatch(addAnnouncementThunk({ title, content, postedBy: `${currentUser.name} (Admin)` }))
        .unwrap()
        .then(() => {
          Alert.alert('Broadcast Sent', 'Announcement published on noticeboard.');
          setTitle('');
          setContent('');
          setErrors({});
        });
    }
  };

  const renderAnnouncementItem = ({ item }) => {
    return (
      <Card style={styles.announceCard}>
        <View style={styles.announceHeader}>
          <Text style={styles.announceTitle}>{item.title}</Text>
          <Text style={styles.announceDate}>{item.date}</Text>
        </View>
        <Text style={styles.announceBody}>{item.content}</Text>
        <View style={styles.separator} />
        <Text style={styles.announceAuthor}>📢 {item.postedBy}</Text>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={STRINGS.announcementsTitle} showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Post New Announcement (Admin Only) */}
        {isAdmin && (
          <Card header={STRINGS.postAnnouncementTitle} style={styles.formCard}>
            <Input
              label="Announcement Title"
              placeholder="e.g. Annual Audit / Holiday"
              value={title}
              onChangeText={setTitle}
              error={errors.title}
            />

            <Input
              label="Announcement Details"
              placeholder="Provide information for the employees..."
              value={content}
              onChangeText={setContent}
              error={errors.content}
              inputStyle={styles.textArea}
            />

            <Button
              title={STRINGS.postBtn}
              type="secondary"
              onPress={handleBroadcast}
              style={styles.broadcastBtn}
            />
          </Card>
        )}

        {/* Noticeboard Announcements Feed */}
        <Text style={styles.feedHeading}>Announcements Bulletin</Text>
        {announcements.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>{STRINGS.noAnnouncements}</Text>
          </Card>
        ) : (
          <FlatList
            data={announcements}
            renderItem={renderAnnouncementItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  formCard: {
    marginBottom: 20,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  broadcastBtn: {
    marginTop: 8,
    marginVertical: 0,
  },
  feedHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  announceCard: {
    marginBottom: 12,
    marginVertical: 0,
  },
  announceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  announceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
    paddingRight: 8,
  },
  announceDate: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  announceBody: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  separator: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginBottom: 8,
  },
  announceAuthor: {
    fontSize: 11,
    color: COLORS.primaryLight,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});

export default AnnouncementsScreen;
