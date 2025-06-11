import React from "react";
import { Card, CardContent, Skeleton, Grid } from "@mui/material";



const ReceivedChatRequestCardSkeleton : React.FC = () => (
  <Grid>
    <Card>
      <CardContent>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          sx={{ mb: 2 }}
        />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
      </CardContent>
    </Card>
  </Grid>
);

export default ReceivedChatRequestCardSkeleton ;
