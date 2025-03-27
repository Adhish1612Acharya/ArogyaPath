import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    // addQuestionDialog: addQuestionDialogReducer,
    // auth: authReducer,
    // securedRoute: securedRouteReducer,
    // viewRevision: viewRevisionReducer,
    // reviseSolution: reviseSolutionDialogReduceder,
    // addRevision: addRevisionDialogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
