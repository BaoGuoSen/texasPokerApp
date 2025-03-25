import React from 'react';

import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type ErrorModalProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  retry?: () => void;
};

const ErrorModal = ({
  visible,
  title,
  message,
  onClose,
  retry
}: ErrorModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {retry && (
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={() => {
                  retry();
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>重试</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryButton: {
    backgroundColor: '#007AFF',
  },
  closeButton: {
    backgroundColor: '#E0E0E0',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default ErrorModal;