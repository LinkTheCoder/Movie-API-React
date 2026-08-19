using System.ComponentModel.DataAnnotations;

namespace MovieApi.DTOs
{
    public class ReviewCreateDto
    {
        [Required]
        [StringLength(100)]
        public string ReviewerName { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Comment { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; }
    }
}
