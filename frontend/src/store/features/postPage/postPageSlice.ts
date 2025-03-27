// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// const initialState: RevisionDialogState = {
//   open: false,
//   activeStep: 0,
//   solutionType: "code",
//   edit: false,
//   addQuestionLoad: false,
// };

// const post = createSlice({
//   name: "addQuestion",
//   initialState,
//   reducers: {
//     incrementActiveStep: (state) => {
//       state.activeStep = state.activeStep + 1;
//     },
//     decrementActiveStep: (state) => {
//       state.activeStep = state.activeStep - 1;
//     },
//     setAddQuestionDialogOpen: (state, action: PayloadAction<boolean>) => {
//       state.open = action.payload;
//     },
//     setSolutionType: (state, action: PayloadAction<"code" | "image">) => {
//       state.solutionType = action.payload;
//     },
//     setActiveStep: (state, action: PayloadAction<number>) => {
//       state.activeStep = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(addQuestion.pending, (state, _action) => {
//       state.addQuestionLoad = true;
//     });

//     builder.addCase(addQuestion.fulfilled, (state, _action) => {
//       state.addQuestionLoad = false;
//     });

//     builder.addCase(addQuestion.rejected, (state, _action) => {
//       state.addQuestionLoad = false;
//     });
//   },
// });

// export default revisionManagingDialog.reducer;

// export const {
//   incrementActiveStep,
//   decrementActiveStep,
//   setAddQuestionDialogOpen,
//   setSolutionType,
//   setActiveStep,
// } = revisionManagingDialog.actions;
