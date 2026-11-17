import Nutrition from "../models/nutrition.js";

// 1. Add food entry
export const addNutrition = async (req, res) => {
  try {
    const { foodName, mealType, calories, protein, carbohydrates, fats, date } =
      req.body;

    const nutrition = await Nutrition.create({
      user: req.user._id,
      foodName,
      mealType,
      calories,
      protein,
      carbohydrates,
      fats,
      date,
    });

    res.status(201).json({
      success: true,
      message: "Food entry added successfully",
      nutrition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. Get all food entries
export const getNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.find({
      user: req.user._id,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: nutrition.length,
      nutrition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. Delete food entry
export const deleteNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!nutrition) {
      return res.status(404).json({
        success: false,
        message: "Food entry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. Get daily nutrition summary
export const getDailyNutritionSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const summary = await Nutrition.aggregate([
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalCalories: {
            $sum: "$calories",
          },
          totalProtein: {
            $sum: "$protein",
          },
          totalCarbohydrates: {
            $sum: "$carbohydrates",
          },
          totalFats: {
            $sum: "$fats",
          },
        },
      },
    ]);

    const result = summary[0] || {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbohydrates: 0,
      totalFats: 0,
    };

    res.status(200).json({
      success: true,
      summary: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
