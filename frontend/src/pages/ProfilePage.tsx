import { Button, Grid } from '@mui/material';
import AppContainer from 'components/AppContainer';
import AppHeader from 'components/AppHeader';
import WorkoutCompleteCard from 'features/workout/components/WorkoutCompleteCard';
import { useAllWorkoutsQuery } from 'store/monkeylogApi';

function Profile() {
  const { data: workouts } = useAllWorkoutsQuery({ type: 'COMPLETED' });

  return (
    <AppContainer header={<AppHeader title="Profile" />}>
      {workouts && (
        <Grid container spacing={1}>
          {workouts.map((val) => (
            <Grid item xs={12} sm={6} md={4} key={val.id}>
              <WorkoutCompleteCard workout={val} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button>LOAD MORE</Button>
          </Grid>
        </Grid>
      )}
    </AppContainer>
  );
}

export default Profile;
