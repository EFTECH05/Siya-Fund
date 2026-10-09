
import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  Pressable,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import styles from "./LoginScreen.styles";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F4FAF6"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Brand header */}
          <View style={styles.brandHeader}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../../assets/images/siya-logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.brandName}>Siya-Fund</Text>

            <Text style={styles.brandTagline}>
              Your money. Your community. Your future.
            </Text>
          </View>

          {/* Main welcome card */}
          <View style={styles.welcomeCard}>
            <LinearGradient
              colors={["#E2F7E9", "#F3FBF5"]}
              style={styles.heroCircle}
            >
              <View style={styles.heroInnerCircle}>
                <Ionicons
                  name="people"
                  size={54}
                  color="#16834A"
                />

                <View style={styles.heroCoin}>
                  <Ionicons
                    name="trending-up"
                    size={23}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            </LinearGradient>

            <Text style={styles.welcomeTitle}>
              Hello, Welcome!
            </Text>

            <Text style={styles.welcomeDescription}>
              Save together, borrow smarter, and build a stronger
              financial future with your community.
            </Text>

            {/* Feature highlights */}
            <View style={styles.features}>
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons
                    name="wallet-outline"
                    size={20}
                    color="#16834A"
                  />
                </View>

                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>
                    Save Together
                  </Text>
                  <Text style={styles.featureDescription}>
                    Grow your savings as a group.
                  </Text>
                </View>

                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#16834A"
                />
              </View>

              <View style={styles.featureDivider} />

              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons
                    name="hand-left-outline"
                    size={20}
                    color="#16834A"
                  />
                </View>

                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>
                    Borrow Smarter
                  </Text>
                  <Text style={styles.featureDescription}>
                    Manage group loans more easily.
                  </Text>
                </View>

                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#16834A"
                />
              </View>

              <View style={styles.featureDivider} />

              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color="#16834A"
                  />
                </View>

                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>
                    Grow with Confidence
                  </Text>
                  <Text style={styles.featureDescription}>
                    Keep track of your financial activity.
                  </Text>
                </View>

                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#16834A"
                />
              </View>
            </View>

            {/* Login button */}
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginButtonText}>
                LOG IN
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </Pressable>

            {/* Registration button */}
            <Pressable
              style={({ pressed }) => [
                styles.signupButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.signupButtonText}>
                CREATE AN ACCOUNT
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerIcon}>
              <Ionicons
                name="lock-closed"
                size={13}
                color="#16834A"
              />
            </View>

            <Text style={styles.footerText}>
              Save Together • Borrow Smarter • Grow Together
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

