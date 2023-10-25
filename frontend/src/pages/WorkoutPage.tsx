import { Button, Collapse, Stack, Typography } from '@mui/material';
import FullScreenModal from 'src/components/FullScreenModal';
import SimpleTimer from 'src/components/SimpleTimer';
import useModal, { ModalType } from 'src/hooks/useModal';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompleteWorkoutMutation, useLazyGetWorkoutQuery } from 'src/store/monkeylogApi';
import { ModalOutlet, useModalOutletContext } from 'src/components/ModalOutlet';
import ExerciseGroupForm from 'src/features/workout/components/ExerciseGroupForm';
import { TransitionGroup } from 'react-transition-group';

const TITLE_MAP = {
  COMPLETED: 'Edit workout',
  TEMPLATE: 'Edit workout',
  ACTIVE: 'Active workout',
};

function WorkoutPage() {
  const navigate = useNavigate();
  const deleteWorkoutModal = useModal(ModalType.DeleteWorkout);
  const { workoutId } = useParams();
  const { modalControls } = useModalOutletContext();
  const [completeWorkout] = useCompleteWorkoutMutation();
  const [getWorkout, { data: workout }] = useLazyGetWorkoutQuery();

  useEffect(() => {
    if (workoutId) {
      getWorkout({ id: workoutId }, true);
    }
  }, [workoutId, getWorkout]);

  return workout ? (
    <FullScreenModal
      header={{
        title: TITLE_MAP[workout.workoutType],
        rightButton: workout.workoutType === 'ACTIVE' && (
          <Button
            color="inherit"
            variant="text"
            onClick={() => completeWorkout().unwrap().then(modalControls.onClose)}
          >
            Complete
          </Button>
        ),
      }}
      {...modalControls}
    >
      <Stack spacing={4}>
        <div>
          <Typography>{workout.name}</Typography>
          <Typography>{workout.note}</Typography>
          {workout.workoutType !== 'TEMPLATE' && (
            <SimpleTimer startDate={workout.startDate} endDate={workout.endDate} />
          )}
        </div>
        {workout.exerciseGroups?.length > 0 && (
          <Stack component={TransitionGroup}>
            {workout.exerciseGroups.map((exerciseGroup, index) => (
              <Collapse key={exerciseGroup.id}>
                <ExerciseGroupForm
                  exerciseGroup={exerciseGroup}
                  exerciseGroupIndex={index}
                  workoutId={workout.id}
                  workoutType={workout.workoutType}
                />
              </Collapse>
            ))}
          </Stack>
        )}
        <Button variant="outlined" sx={{ height: 24 }} onClick={() => navigate('exercises')}>
          Add exercise
        </Button>
        <Button
          variant="outlined"
          sx={{ height: 24 }}
          color="error"
          onClick={() => deleteWorkoutModal.open()}
        >
          {workout.workoutType === 'ACTIVE' ? 'Cancel workout' : 'Delete workout'}
        </Button>
      </Stack>
      <ModalOutlet />
    </FullScreenModal>
  ) : null;
}

export default WorkoutPage;
