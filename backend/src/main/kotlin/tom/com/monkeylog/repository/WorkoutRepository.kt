package tom.com.monkeylog.repository

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import tom.com.monkeylog.common.dto.IdProjection
import tom.com.monkeylog.dto.statistics.StatisticsResponse
import tom.com.monkeylog.model.workout.Workout
import tom.com.monkeylog.model.workout.WorkoutType
import java.util.*

interface WorkoutRepository : JpaRepository<Workout, UUID> {
    @EntityGraph(attributePaths = ["exerciseGroups.exercise", "exerciseGroups.exerciseRows"])
    override fun findById(id: UUID): Optional<Workout>

    @EntityGraph(attributePaths = ["exerciseGroups.exercise", "exerciseGroups.exerciseRows"])
    fun findAllByWorkoutTypeAndUserId(workoutType: WorkoutType, userId: UUID): List<Workout>

    fun findAllByWorkoutTypeAndUserId(workoutType: WorkoutType, userId: UUID, pageable: Pageable): Page<IdProjection>

    @EntityGraph(attributePaths = ["exerciseGroups.exercise", "exerciseGroups.exerciseRows"])
    fun findAllByIdIn(ids: List<UUID>): List<Workout>

    @Query("SELECT COUNT(w) FROM Workout w WHERE w.userId = :userId AND w.workoutType = 'COMPLETED'")
    fun workoutCountUser(userId: UUID): Long

    @Query("SELECT SUM(w.startDate - w.endDate) FROM Workout w WHERE w.userId = :userId AND w.workoutType = 'COMPLETED'")
    fun totalTimeUser(userId: UUID): Long

    @Query(
        "SELECT SUM(er.weight * er.reps) FROM ExerciseRow er " +
                "WHERE er.userId = :userId AND er.exerciseGroup.workout.workoutType = 'COMPLETED'"
    )
    fun totalVolumeUser(userId: UUID): Long

    @Query(
        "SELECT new tom.com.monkeylog.dto.statistics.StatisticsResponse(function('date_trunc', 'week', w.startDate), count(w.id)) FROM Workout w " +
                "WHERE w.userId = :userId AND w.workoutType = 'COMPLETED' " +
                "GROUP BY function('date_trunc', 'week', w.startDate) " +
                "ORDER BY function('date_trunc', 'week', w.startDate)"
    )
    fun weeklyWorkoutCountUser(userId: UUID): List<StatisticsResponse>
}
