import { Card, CardActionArea, CardContent, CardHeader, Typography } from '@mui/material';
import { Workout } from 'features/workout/types';
import WorkoutActions from 'features/workout/components/WorkoutActions';

interface WorkoutCardProps {
  workout: Workout;
  onClick: () => void;
}

function WorkoutCard(props: WorkoutCardProps) {
  const { workout, onClick } = props;

  return (
    <Card variant="outlined">
      <CardActionArea component="a" onClick={onClick}>
        <CardHeader
          action={<WorkoutActions workout={workout} />}
          title={<Typography>{workout.name}</Typography>}
        />
        {workout.exerciseGroups.length > 0 && (
          <CardContent sx={{ pt: 0 }}>
            {workout.exerciseGroups.map((exerciseGroup) => (
              <Typography key={exerciseGroup.id} color="text.secondary">
                {exerciseGroup.exerciseRows.length} x {exerciseGroup.exercise.name}
              </Typography>
            ))}
          </CardContent>
        )}
      </CardActionArea>
    </Card>
  );
}

export default WorkoutCard;
