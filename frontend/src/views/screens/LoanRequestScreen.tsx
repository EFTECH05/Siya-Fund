import React, { useState } from 'react';
import { auth } from '../../services/firebase';
import { requestLoan } from '../../controllers/LoanController';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';

export default function LoanRequestScreen() {
  const params = useLocalSearchParams();
  const groupId = Array.isArray(params.groupId)
    ? params.groupId[0]
    : params.groupId;

const [userId, setUserId] = useState<string | null>(
  auth.currentUser?.uid ?? null
);

const [authReady, setAuthReady] = useState(
  Boolean(auth.currentUser)
);

React.useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUserId(user?.uid ?? null);
    setAuthReady(true);
  });

  return unsubscribe;
}, []);

  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const clearError = (field: string) => {
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[field];
      return updatedErrors;
    });
  };


const handleSubmit = async () => {
  if (loading) return;

  if (!authReady || !userId) {
    Alert.alert(
      'Login required',
      'Please wait for authentication or sign in again.'
    );
    return;
  }

  setLoading(true);
  setErrors({});

  try {
    const result = await requestLoan({
      userId,
      groupId,
      amount,
      reason,
    });

    if (!result.success) {
      setErrors(result.errors || {});
      if (result.errors?.general) {
        Alert.alert('Error', result.errors.general);
      }
      return;
    }

    Alert.alert(
      'Loan Request Submitted',
      'Your application has been saved with Pending status.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  } catch (error) {
    console.error('Loan submission error:', error);
    Alert.alert(
      'Submission failed',
      'We could not submit your request. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};


 return (
     <KeyboardAvoidingView
       style={styles.container}
       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
     >
       <StatusBar
         barStyle="light-content"
         backgroundColor="#176B45"
       />

       <ScrollView
         contentContainerStyle={styles.scrollContent}
         keyboardShouldPersistTaps="handled"
         showsVerticalScrollIndicator={false}
       >
         {/* Green header */}
         <View style={styles.header}>
           <View style={styles.headerDecoration} />
           <View style={styles.headerDecorationSmall} />

           <Pressable
             onPress={() => router.back()}
             style={styles.backButton}
             accessibilityRole="button"
             accessibilityLabel="Go back"
           >
             <Text style={styles.backIcon}>‹</Text>
             <Text style={styles.backLabel}>Back</Text>
           </Pressable>

           <View style={styles.brandRow}>
             <View style={styles.brandIcon}>
               <Text style={styles.brandIconText}>S</Text>
             </View>
             <Text style={styles.brandName}>SIYA-FUND</Text>
           </View>

           <Text style={styles.headerTitle}>Request a Loan</Text>

           <Text style={styles.headerSubtitle}>
             A helping hand for your next step.
           </Text>

           <View style={styles.headerBottomRow}>
             <View style={styles.headerStatusDot} />
             <Text style={styles.headerStatusText}>
               Savings group financing
             </Text>
           </View>
         </View>

         <View style={styles.mainContent}>
           {/* Introductory card */}
           <View style={styles.introCard}>
             <View style={styles.introIcon}>
               <Text style={styles.introIconText}>R</Text>
             </View>

             <View style={styles.introTextContainer}>
               <Text style={styles.introTitle}>
                 Your financial goals matter
               </Text>
               <Text style={styles.introDescription}>
                 Tell your savings group how much you need and
                 what you plan to use it for.
               </Text>
             </View>
           </View>

           {/* Application form */}
           <View style={styles.formCard}>
             <View style={styles.sectionHeading}>
               <View style={styles.sectionAccent} />
               <View style={styles.sectionHeadingText}>
                 <Text style={styles.sectionTitle}>
                   Loan application
                 </Text>
                 <Text style={styles.sectionSubtitle}>
                   Complete the details below
                 </Text>
               </View>
             </View>

             {/* Loan amount */}
             <View style={styles.fieldContainer}>
               <Text style={styles.label}>Loan amount</Text>
               <Text style={styles.fieldHint}>
                 Enter the amount you would like to borrow.
               </Text>

               <View
                 style={[
                   styles.amountInputContainer,
                   errors.amount && styles.inputError,
                 ]}
               >
                 <View style={styles.currencyContainer}>
                   <Text style={styles.currencySymbol}>R</Text>
                 </View>

                 <TextInput
                   style={styles.amountInput}
                   placeholder="0.00"
                   placeholderTextColor="#9AA99F"
                   value={amount}
                   onChangeText={(value) => {
                     setAmount(value);
                     clearError('amount');
                   }}
                   keyboardType="decimal-pad"
                   maxLength={12}
                   accessibilityLabel="Loan amount in rand"
                 />
                 <Text style={styles.currencyCode}>ZAR</Text>
               </View>

               {errors.amount ? (
                 <Text style={styles.errorText}>
                   {errors.amount}
                 </Text>
               ) : null}
             </View>

             {/* Reason */}
             <View style={styles.fieldContainer}>
               <View style={styles.labelRow}>
                 <Text style={styles.label}>
                   Reason for borrowing
                 </Text>
                 <Text style={styles.requiredLabel}>
                   Required
                 </Text>
               </View>

               <Text style={styles.fieldHint}>
                 Explain how this loan will help you.
               </Text>

               <TextInput
                 style={[
                   styles.reasonInput,
                   errors.reason && styles.inputError,
                 ]}
                 placeholder={
                   'For example, school fees, business expenses, or an emergency...'
                 }
                 placeholderTextColor="#9AA99F"
                 value={reason}
                 onChangeText={(value) => {
                   setReason(value);
                   clearError('reason');
                 }}
                 multiline
                 textAlignVertical="top"
                 maxLength={500}
                 accessibilityLabel="Reason for requesting the loan"
               />

               <View style={styles.helperRow}>
                 <Text style={styles.helperText}>
                   Please provide at least 10 characters.
                 </Text>
                 <Text style={styles.characterCount}>
                   {reason.length}/500
                 </Text>
               </View>

               {errors.reason ? (
                 <Text style={styles.errorText}>
                   {errors.reason}
                 </Text>
               ) : null}
             </View>

             {/* Group validation */}
             {!groupId ? (
               <View style={styles.warningCard}>
                 <Text style={styles.warningTitle}>
                   Savings group required
                 </Text>
                 <Text style={styles.warningText}>
                   Open this form from your selected savings group
                   to associate your application correctly.
                 </Text>
               </View>
             ) : null}

             {errors.groupId ? (
               <Text style={styles.errorText}>
                 {errors.groupId}
               </Text>
             ) : null}

             {errors.general ? (
               <Text style={styles.errorText}>
                 {errors.general}
               </Text>
             ) : null}

             {errors.userId ? (
               <Text style={styles.errorText}>
                 {errors.userId}
               </Text>
             ) : null}

             {/* Status */}
             <View style={styles.statusCard}>
               <View style={styles.statusIcon}>
                 <Text style={styles.statusIconText}>✓</Text>
               </View>

               <View style={styles.statusInfo}>
                 <Text style={styles.statusTitle}>
                   Application status
                 </Text>
                 <Text style={styles.statusDescription}>
                   Awaiting group review
                 </Text>
               </View>

               <View style={styles.pendingBadge}>
                 <View style={styles.pendingDot} />
                 <Text style={styles.pendingText}>Pending</Text>
               </View>
             </View>

             {/* Submit */}
             <Pressable
               style={({ pressed }) => [
                 styles.submitButton,
                 pressed && !loading && styles.submitPressed,
                 (loading || !authReady || !groupId) &&
                   styles.disabledButton,
               ]}
               onPress={handleSubmit}
               disabled={loading || !authReady || !groupId}
               accessibilityRole="button"
               accessibilityLabel="Submit loan request"
             >
               {loading ? (
                 <ActivityIndicator color="#FFFFFF" />
               ) : (
                 <>
                   <Text style={styles.submitText}>
                     Submit loan request
                   </Text>
                   <Text style={styles.submitArrow}>→</Text>
                 </>
               )}
             </Pressable>

             <Text style={styles.disclaimer}>
               By submitting, you confirm that the information
               provided is accurate and complete.
             </Text>
           </View>

           {/* Reassurance footer */}
           <View style={styles.footer}>
             <View style={styles.footerLine} />
             <Text style={styles.footerText}>
               Building stronger savings, together.
             </Text>
             <View style={styles.footerLine} />
           </View>

           <Text style={styles.versionText}>
             SIYA-FUND  •  MEMBER SERVICES
           </Text>
         </View>
       </ScrollView>
     </KeyboardAvoidingView>
   );
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#F3F8F4',
   },
   scrollContent: {
     flexGrow: 1,
     paddingBottom: 28,
   },

   // Header
   header: {
     backgroundColor: '#176B45',
     paddingHorizontal: 24,
     paddingTop: Platform.OS === 'android' ? 24 : 52,
     paddingBottom: 30,
     borderBottomLeftRadius: 28,
     borderBottomRightRadius: 28,
     overflow: 'hidden',
   },
   headerDecoration: {
     position: 'absolute',
     width: 190,
     height: 190,
     borderRadius: 95,
     backgroundColor: 'rgba(255,255,255,0.055)',
     right: -65,
     top: 35,
   },
   headerDecorationSmall: {
     position: 'absolute',
     width: 115,
     height: 115,
     borderRadius: 58,
     backgroundColor: 'rgba(255,255,255,0.045)',
     right: 55,
     top: -65,
   },
   backButton: {
     flexDirection: 'row',
     alignItems: 'center',
     alignSelf: 'flex-start',
     marginBottom: 26,
     paddingVertical: 4,
     paddingRight: 12,
   },
   backIcon: {
     fontSize: 30,
     lineHeight: 32,
     color: '#FFFFFF',
     marginRight: 7,
   },
   backLabel: {
     color: '#E5F5EA',
     fontSize: 14,
     fontWeight: '600',
   },
   brandRow: {
     flexDirection: 'row',
     alignItems: 'center',
     marginBottom: 22,
     gap: 10,
   },
   brandIcon: {
     width: 34,
     height: 34,
     borderRadius: 11,
     backgroundColor: '#DDF5E5',
     alignItems: 'center',
     justifyContent: 'center',
   },
   brandIconText: {
     color: '#176B45',
     fontSize: 21,
     fontWeight: '900',
   },
   brandName: {
     color: '#DDF5E5',
     fontSize: 12,
     fontWeight: '800',
     letterSpacing: 2,
   },
   headerTitle: {
     fontSize: 30,
     lineHeight: 38,
     fontWeight: '800',
     color: '#FFFFFF',
     letterSpacing: -0.6,
   },
   headerSubtitle: {
     fontSize: 15,
     color: '#D6EBDD',
     lineHeight: 23,
     marginTop: 6,
   },
   headerBottomRow: {
     flexDirection: 'row',
     alignItems: 'center',
     alignSelf: 'flex-start',
     marginTop: 19,
     backgroundColor: 'rgba(255,255,255,0.11)',
     borderRadius: 20,
     paddingHorizontal: 12,
     paddingVertical: 8,
   },
   headerStatusDot: {
     width: 7,
     height: 7,
     borderRadius: 4,
     backgroundColor: '#A8E6BA',
     marginRight: 8,
   },
   headerStatusText: {
     color: '#F1FBF4',
     fontSize: 12,
     fontWeight: '600',
   },

   // Main content
   mainContent: {
     width: '100%',
     maxWidth: 650,
     alignSelf: 'center',
     paddingHorizontal: 18,
     paddingTop: 22,
   },
   introCard: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#E4F5E9',
     borderWidth: 1,
     borderColor: '#D0EBD9',
     borderRadius: 17,
     padding: 17,
     marginBottom: 22,
     gap: 13,
   },
   introIcon: {
     width: 46,
     height: 46,
     borderRadius: 14,
     backgroundColor: '#C9EBD4',
     alignItems: 'center',
     justifyContent: 'center',
   },
   introIconText: {
     fontSize: 24,
     color: '#176B45',
     fontWeight: '800',
   },
   introTextContainer: {
     flex: 1,
   },
   introTitle: {
     fontSize: 15,
     fontWeight: '800',
     color: '#194F35',
     marginBottom: 5,
   },
   introDescription: {
     fontSize: 13,
     lineHeight: 19,
     color: '#537361',
   },

   // Form card
   formCard: {
     backgroundColor: '#FFFFFF',
     borderRadius: 20,
     borderWidth: 1,
     borderColor: '#E2ECE5',
     padding: 21,
     shadowColor: '#164E32',
     shadowOffset: { width: 0, height: 5 },
     shadowOpacity: 0.055,
     shadowRadius: 14,
     elevation: 3,
   },
   sectionHeading: {
     flexDirection: 'row',
     alignItems: 'stretch',
     marginBottom: 25,
   },
   sectionAccent: {
     width: 4,
     borderRadius: 4,
     backgroundColor: '#42A66B',
     marginRight: 12,
   },
   sectionHeadingText: {
     flex: 1,
   },
   sectionTitle: {
     fontSize: 19,
     color: '#183B29',
     fontWeight: '800',
   },
   sectionSubtitle: {
     fontSize: 13,
     color: '#84938A',
     marginTop: 4,
   },
   fieldContainer: {
     marginBottom: 23,
   },
   label: {
     fontSize: 14,
     color: '#254432',
     fontWeight: '700',
     marginBottom: 7,
   },
   labelRow: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
   },
   requiredLabel: {
     color: '#3D8B5B',
     backgroundColor: '#EAF6ED',
     fontSize: 10,
     fontWeight: '700',
     paddingHorizontal: 9,
     paddingVertical: 5,
     borderRadius: 6,
     overflow: 'hidden',
   },
   fieldHint: {
     color: '#819087',
     fontSize: 12,
     lineHeight: 18,
     marginBottom: 11,
   },
   amountInputContainer: {
     flexDirection: 'row',
     alignItems: 'center',
     borderWidth: 1,
     borderColor: '#DCE8DF',
     backgroundColor: '#FBFDFB',
     borderRadius: 12,
     minHeight: 58,
     paddingHorizontal: 13,
   },
   currencyContainer: {
     width: 35,
     height: 35,
     borderRadius: 10,
     backgroundColor: '#E4F5E9',
     alignItems: 'center',
     justifyContent: 'center',
     marginRight: 10,
   },
   currencySymbol: {
     color: '#176B45',
     fontSize: 18,
     fontWeight: '800',
   },
   amountInput: {
     flex: 1,
     minWidth: 0,
     fontSize: 20,
     color: '#183B29',
     fontWeight: '700',
     paddingVertical: 12,
   },
   currencyCode: {
     fontSize: 11,
     color: '#83958A',
     fontWeight: '700',
     letterSpacing: 1,
     marginLeft: 8,
   },
   reasonInput: {
     minHeight: 135,
     borderWidth: 1,
     borderColor: '#DCE8DF',
     backgroundColor: '#FBFDFB',
     borderRadius: 12,
     paddingHorizontal: 14,
     paddingVertical: 14,
     fontSize: 14,
     lineHeight: 21,
     color: '#233E2D',
   },
   inputError: {
     borderColor: '#D64B4B',
     backgroundColor: '#FFFAFA',
   },
   helperRow: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     marginTop: 8,
   },
   helperText: {
     flex: 1,
     fontSize: 11,
     color: '#8B998F',
     marginRight: 8,
   },
   characterCount: {
     fontSize: 11,
     color: '#71867A',
     fontWeight: '600',
   },
   errorText: {
     color: '#C62828',
     fontSize: 12,
     lineHeight: 18,
     marginTop: 7,
   },

   // Pending status
   statusCard: {
     flexDirection: 'row',
     alignItems: 'center',
     padding: 13,
     backgroundColor: '#F6FAF6',
     borderWidth: 1,
     borderColor: '#E5EEE6',
     borderRadius: 13,
     marginBottom: 20,
     gap: 10,
   },
   statusIcon: {
     width: 37,
     height: 37,
     borderRadius: 12,
     backgroundColor: '#DDF2E3',
     alignItems: 'center',
     justifyContent: 'center',
   },
   statusIconText: {
     color: '#267A49',
     fontSize: 19,
     fontWeight: '800',
   },
   statusInfo: {
     flex: 1,
   },
   statusTitle: {
     fontSize: 13,
     color: '#294B35',
     fontWeight: '700',
   },
   statusDescription: {
     fontSize: 11,
     color: '#819187',
     marginTop: 4,
   },
   pendingBadge: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#FFF4D9',
     borderRadius: 8,
     paddingHorizontal: 9,
     paddingVertical: 7,
     gap: 6,
   },
   pendingDot: {
     width: 6,
     height: 6,
     borderRadius: 3,
     backgroundColor: '#C18A1A',
   },
   pendingText: {
     fontSize: 11,
     color: '#8C6514',
     fontWeight: '800',
   },

   // Submit button
   submitButton: {
     minHeight: 55,
     backgroundColor: '#21834F',
     borderRadius: 13,
     paddingHorizontal: 18,
     paddingVertical: 15,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     shadowColor: '#176B45',
     shadowOffset: { width: 0, height: 4 },
     shadowOpacity: 0.17,
     shadowRadius: 7,
     elevation: 3,
   },
   submitPressed: {
     backgroundColor: '#176B45',
     transform: [{ scale: 0.99 }],
   },
   disabledButton: {
     opacity: 0.55,
     shadowOpacity: 0,
     elevation: 0,
   },
   submitText: {
     color: '#FFFFFF',
     fontSize: 15,
     fontWeight: '800',
     letterSpacing: 0.2,
   },
   submitArrow: {
     color: '#FFFFFF',
     fontSize: 21,
     fontWeight: '600',
     marginLeft: 12,
   },
   disclaimer: {
     fontSize: 11,
     lineHeight: 17,
     color: '#8A988E',
     textAlign: 'center',
     marginTop: 14,
     paddingHorizontal: 4,
   },

   // Footer
   warningCard: {
     padding: 13,
     borderRadius: 11,
     backgroundColor: '#FFF8E8',
     borderWidth: 1,
     borderColor: '#F1E2B9',
     marginBottom: 16,
   },
   warningTitle: {
     color: '#805F16',
     fontSize: 13,
     fontWeight: '800',
     marginBottom: 5,
   },
   warningText: {
     color: '#806E48',
     fontSize: 12,
     lineHeight: 18,
   },
   footer: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     gap: 10,
     marginTop: 26,
   },
   footerLine: {
     height: 1,
     backgroundColor: '#D6E6D9',
     flex: 1,
   },
   footerText: {
     color: '#5D8069',
     fontSize: 11,
     fontWeight: '600',
   },
   versionText: {
     textAlign: 'center',
     fontSize: 9,
     color: '#9BAAA0',
     letterSpacing: 1.5,
     marginTop: 13,
   },
 });